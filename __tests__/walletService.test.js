import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DATA_PLANS } from '../src/utils/constants';

// walletService keeps an in-memory "backend" at module level, so each test
// gets a fresh copy of the module and a unique token.
let walletService;
let token;
let n = 0;

// Every call simulates network latency with setTimeout; fast-forward it.
const run = async (promise) => {
  await vi.runAllTimersAsync();
  return promise;
};

beforeEach(async () => {
  vi.useFakeTimers();
  vi.resetModules();
  ({ walletService } = await import('../src/services/walletService'));
  token = `test-token-${++n}`;
});

afterEach(() => {
  vi.useRealTimers();
});

const START = 12260;
const mtn1gb = DATA_PLANS.mtn.find((p) => p.id === 'mtn_1gb_30');

describe('balance and transactions', () => {
  it('starts with the demo balance and seeded history', async () => {
    expect(await run(walletService.getBalance(token))).toEqual({ success: true, balance: START });
    const { transactions, hasMore } = await run(walletService.getTransactions(token));
    expect(transactions).toHaveLength(6);
    expect(hasMore).toBe(false);
  });

  it('paginates transactions', async () => {
    const page1 = await run(walletService.getTransactions(token, 1, 4));
    const page2 = await run(walletService.getTransactions(token, 2, 4));
    expect(page1.transactions).toHaveLength(4);
    expect(page1.hasMore).toBe(true);
    expect(page2.transactions).toHaveLength(2);
    expect(page2.hasMore).toBe(false);
  });
});

describe('fundWallet / withdraw', () => {
  it('credits and debits the balance and records transactions', async () => {
    expect((await run(walletService.fundWallet(token, 1000, { type: 'Card' }))).newBalance).toBe(START + 1000);
    const res = await run(
      walletService.withdraw(token, 500, { bankName: 'Zenith Bank', accountNumber: '0123456789' })
    );
    expect(res.newBalance).toBe(START + 500);

    const { transactions } = await run(walletService.getTransactions(token));
    expect(transactions[0]).toMatchObject({ type: 'withdraw', amount: -500, description: 'Withdrawal to Zenith Bank ****6789' });
    expect(transactions[1]).toMatchObject({ type: 'fund_wallet', amount: 1000 });
  });

  it('refuses to withdraw more than the balance', async () => {
    const res = await run(walletService.withdraw(token, START + 1, { bankName: 'X', accountNumber: '0000000000' }));
    expect(res).toEqual({ success: false, error: 'Insufficient wallet balance.' });
    expect((await run(walletService.getBalance(token))).balance).toBe(START);
  });

  it.each([-5000, 0, NaN, Infinity])('rejects an invalid amount (%s) without touching the balance', async (amt) => {
    // Regression: withdraw(-5000) used to *add* ₦5,000.
    expect(await run(walletService.withdraw(token, amt, { bankName: 'X', accountNumber: '0000000000' }))).toEqual({
      success: false,
      error: 'Enter a valid amount.',
    });
    expect(await run(walletService.fundWallet(token, amt))).toMatchObject({ success: false });
    expect((await run(walletService.getBalance(token))).balance).toBe(START);
  });
});

describe('buyAirtime', () => {
  it('debits the wallet', async () => {
    const res = await run(walletService.buyAirtime(token, 'glo', 200, '08098765432'));
    expect(res.success).toBe(true);
    expect((await run(walletService.getBalance(token))).balance).toBe(START - 200);
  });

  it('rejects negative amounts and insufficient balance', async () => {
    expect((await run(walletService.buyAirtime(token, 'glo', -200, '080'))).success).toBe(false);
    expect((await run(walletService.buyAirtime(token, 'glo', START + 1, '080'))).success).toBe(false);
    expect((await run(walletService.getBalance(token))).balance).toBe(START);
  });
});

describe('buyData', () => {
  it('debits the plan price via direct top-up', async () => {
    const res = await run(walletService.buyData(token, 'mtn', mtn1gb.id, '08012345678'));
    expect(res).toMatchObject({ success: true, amount: mtn1gb.price });
    const { transactions } = await run(walletService.getTransactions(token));
    expect(transactions[0]).toMatchObject({ type: 'buy_data', source: 'direct', amount: -mtn1gb.price });
  });

  it('rejects unknown networks and plans', async () => {
    expect(await run(walletService.buyData(token, 'nope', mtn1gb.id, '080'))).toEqual({ success: false, error: 'Invalid network.' });
    expect(await run(walletService.buyData(token, 'mtn', 'nope', '080'))).toEqual({ success: false, error: 'Invalid plan selected.' });
  });
});

describe('sellData and the resale inventory', () => {
  it('credits sellPrice × quantity and adds to inventory', async () => {
    const res = await run(walletService.sellData(token, 'mtn', mtn1gb.id, 2));
    expect(res.creditAmount).toBe(mtn1gb.sellPrice * 2);
    expect((await run(walletService.getBalance(token))).balance).toBe(START + mtn1gb.sellPrice * 2);
    const { inventory } = await run(walletService.getDataInventory(token));
    expect(inventory).toHaveLength(1);
    expect(inventory[0]).toMatchObject({ planId: mtn1gb.id, quantity: 2 });
  });

  it('buying a plan that is in inventory resells it and decrements stock', async () => {
    await run(walletService.sellData(token, 'mtn', mtn1gb.id, 1));
    await run(walletService.buyData(token, 'mtn', mtn1gb.id, '08012345678'));

    const { transactions } = await run(walletService.getTransactions(token));
    expect(transactions[0].source).toBe('inventory');
    expect((await run(walletService.getDataInventory(token))).inventory).toEqual([]);
  });

  it.each([0, -1, 1.5])('rejects quantity %s without crediting', async (q) => {
    // Regression: a negative quantity used to debit / a fractional one to credit.
    expect(await run(walletService.sellData(token, 'mtn', mtn1gb.id, q))).toEqual({
      success: false,
      error: 'Quantity must be at least 1.',
    });
    expect((await run(walletService.getBalance(token))).balance).toBe(START);
  });
});
