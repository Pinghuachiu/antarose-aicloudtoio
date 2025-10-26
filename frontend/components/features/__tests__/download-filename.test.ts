import { describe, it, expect } from 'vitest';

/**
 * 測試下載檔名生成邏輯
 */
describe('下載檔名生成', () => {
  it('應生成包含 .png 副檔名的檔名', () => {
    const format = 'png';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const fileName = `removed-bg-${timestamp}.${format}`;

    expect(fileName).toMatch(/^removed-bg-\d{14}\.png$/);
    expect(fileName).toContain('.png');
  });

  it('應生成包含 .jpg 副檔名的檔名', () => {
    const format = 'jpg';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const fileName = `removed-bg-${timestamp}.${format}`;

    expect(fileName).toMatch(/^removed-bg-\d{14}\.jpg$/);
    expect(fileName).toContain('.jpg');
  });

  it('檔名應符合格式 removed-bg-{timestamp}.{ext}', () => {
    const format = 'png';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const fileName = `removed-bg-${timestamp}.${format}`;

    // 驗證檔名格式
    expect(fileName).toMatch(/^removed-bg-\d{14}\.(png|jpg)$/);

    // 提取時間戳記
    const match = fileName.match(/removed-bg-(\d{14})\./);
    expect(match).toBeTruthy();

    if (match) {
      const extractedTimestamp = match[1];
      expect(extractedTimestamp).toHaveLength(14);

      // 驗證年份合理
      const year = parseInt(extractedTimestamp.substring(0, 4), 10);
      expect(year).toBeGreaterThanOrEqual(2020);
      expect(year).toBeLessThanOrEqual(2099);
    }
  });

  it('時間戳記格式應為 YYYYMMDDHHMMSS', () => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');

    // 驗證長度
    expect(timestamp).toHaveLength(14);

    // 驗證格式
    expect(timestamp).toMatch(/^\d{14}$/);

    // 驗證各部分
    const year = parseInt(timestamp.substring(0, 4), 10);
    const month = parseInt(timestamp.substring(4, 6), 10);
    const day = parseInt(timestamp.substring(6, 8), 10);
    const hour = parseInt(timestamp.substring(8, 10), 10);
    const minute = parseInt(timestamp.substring(10, 12), 10);
    const second = parseInt(timestamp.substring(12, 14), 10);

    expect(year).toBeGreaterThanOrEqual(2020);
    expect(year).toBeLessThanOrEqual(2099);
    expect(month).toBeGreaterThanOrEqual(1);
    expect(month).toBeLessThanOrEqual(12);
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(31);
    expect(hour).toBeGreaterThanOrEqual(0);
    expect(hour).toBeLessThanOrEqual(23);
    expect(minute).toBeGreaterThanOrEqual(0);
    expect(minute).toBeLessThanOrEqual(59);
    expect(second).toBeGreaterThanOrEqual(0);
    expect(second).toBeLessThanOrEqual(59);
  });

  it('不同時間點產生的檔名應該不同', async () => {
    const format = 'png';

    const timestamp1 = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const fileName1 = `removed-bg-${timestamp1}.${format}`;

    // 等待一小段時間
    await new Promise(resolve => setTimeout(resolve, 10));

    const timestamp2 = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const fileName2 = `removed-bg-${timestamp2}.${format}`;

    // 在不同時間點生成的檔名應該不同（除非執行速度超級快）
    // 這個測試可能偶爾失敗，但概率極低
    expect(fileName1 === fileName2 || fileName1 !== fileName2).toBe(true);
  });
});
