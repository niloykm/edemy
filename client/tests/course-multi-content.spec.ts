import { test, expect } from '@playwright/test';

test.describe('Multi-Format Course Content and Downloadable Non-Media Assets', () => {
  test('distributed systems design course renders multi-content lessons and download options', async ({ page }) => {
    // Navigate directly to the distributed systems design course
    await page.goto('http://localhost:3000/courses/distributed-systems-design');

    // Verify Title and Multi-Format badge
    await expect(page.locator('h1')).toContainText('Distributed Systems');
    await expect(page.getByText('Multi-Format Content')).toBeVisible();

    // Verify curriculum modules are loaded
    await expect(page.getByText('Module 1: Consistency, Availability & Consensus')).toBeVisible();
    await expect(page.getByText('Module 2: High-Throughput Streaming & Messaging')).toBeVisible();
    await expect(page.getByText('Module 3: Sharding, Partitioning & Caching')).toBeVisible();
    await expect(page.getByText('Module 4: Real-World Case Studies')).toBeVisible();

    // Verify format badges in the curriculum list
    await expect(page.locator('text=Raft Consensus State Machine Architecture Blueprint')).toBeVisible();
    await expect(page.locator('text=Audio Deep-Dive: Staff Engineer Roundtable on Raft vs Multi-Paxos')).toBeVisible();
    await expect(page.locator('text=System Design Interview Cheatsheet & Formulas (Staff Level)')).toBeVisible();

    // 1. Test Image / Blueprint Lesson (ds-2)
    const blueprintItem = page.locator('text=Raft Consensus State Machine Architecture Blueprint');
    await blueprintItem.click();

    // Check that Image Blueprint viewer is displayed
    await expect(page.getByText('System Blueprint')).toBeVisible();
    await expect(page.getByRole('button', { name: /Download Blueprint/i }).first()).toBeVisible();

    // 2. Test Audio Lesson (ds-3) - Media content, should NOT have download button
    const audioItem = page.locator('text=Audio Deep-Dive: Staff Engineer Roundtable on Raft vs Multi-Paxos');
    await audioItem.click();

    // Check that Audio Studio is displayed with waveform & controls
    await expect(page.getByText('Audio Deep-Dive & Discussion (Media Stream)')).toBeVisible();
    await expect(page.getByRole('button', { name: /Play audio/i })).toBeVisible();
    await expect(page.getByText('Speed')).toBeVisible();

    // Crucial check: Audio is media, so no download button should be rendered in the player
    const audioPlayerDownloadBtn = page.locator('div.bg-slate-900').filter({ hasText: 'Audio Deep-Dive & Discussion' }).getByRole('button', { name: /Download/i });
    await expect(audioPlayerDownloadBtn).toHaveCount(0);

    // 3. Test PDF Lesson (ds-12) - Non-media, SHOULD have download button
    const pdfItem = page.locator('text=System Design Interview Cheatsheet & Formulas (Staff Level)');
    await pdfItem.click();

    await expect(page.getByText('Technical PDF Whitepaper & Reference Guide')).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PDF/i }).first()).toBeVisible();
    await expect(page.getByText('Open Fullscreen')).toBeVisible();

    // 4. Test Engineering Spec / Doc Lesson (ds-4)
    const docItem = page.locator('text=Distributed Transactions: 2PC vs Saga Orchestration Specification');
    await docItem.click();

    await expect(page.getByRole('button', { name: /Download File/i }).first()).toBeVisible();
    await expect(page.getByText('Technical Specification Synopsis')).toBeVisible();

    // 5. Test Link / Interactive Simulator (ds-6)
    const linkItem = page.locator('text=Interactive Event Streaming & Broker Failure Simulator');
    await linkItem.click();

    await expect(page.getByText('Interactive Online Lab & Specification Resource')).toBeVisible();
    await expect(page.getByText('Launch Interactive Lab')).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy URL/i })).toBeVisible();

    // 6. Test Free Preview Video Lesson (ds-1)
    const videoItem = page.locator('text=Deconstructing CAP, PACELC and Real Latency Costs');
    await videoItem.click();

    await expect(page.locator('h2', { hasText: 'Interactive Learning Classroom' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Video Lecture' })).toBeVisible();
    await expect(page.locator('video')).toBeVisible();

    // Verify download trigger for non-media
    await blueprintItem.click();
    await page.getByRole('button', { name: /Download Blueprint/i }).first().click();

    // Confirm that download started or was handled cleanly
    await expect(page.getByText(/Download/i).first()).toBeVisible();
  });
});
