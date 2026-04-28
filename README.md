# FocusTimer 🚀

FocusTimer is a visually polished, single-task oriented web app built to help users deeply focus during timed problem-solving or study sessions. With features like time banking, sound alerts, and accountability tracking, it encourages zero-distraction productivity.

## 🌟 Features

- **Paced Engine:** Automatically calculates exact seconds needed per question based on your total session time.
- **The "Bank":** Finish a question early? The saved time is dynamically visualized and banked for harder questions down the line. 
- **Auto-Advance:** When time hits 00:00, it safely begins draining your bank. Once the bank hits 0, it dynamically jumps to the next question.
- **Accountability Pause:** An intricate red stopwatch runs when paused to log wasted or distraction time, letting users measure actual efficiency.
- **Ambient Audio & Visuals:** Features an energetic "whoosh" sound at each milestone with visual rocket progression, accompanied by digital/soft alert themes depending on your preference.
- **Mobile First & High Polish:** Responsive scrolling background, gorgeous bento-grid stats post-session, and smooth layout animations powered by Framer Motion.

## 🛠️ Stack

- React 18
- TypeScript
- Vite
- Framer Motion (Animation logic)
- Tailwind CSS (Styling)

## 🚀 How to Use

1. Enter your `Total Questions` and `Total Time (mins)`.
2. Hit **Start Session**. Put distractions away.
3. Finish a question before the timer hits 0:00 to add leftover time to your **Bank**.
4. Use **Pause** for emergencies—but be prepared to confront your red-tracked extra time at the end!
5. After finishing all questions, review your completed session metrics and notes in the comprehensive summary view.

## 🏃‍♂️ Getting Started

1. Check out the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the development server:
   ```bash
   npm run dev
   ```

## ⚖️ License
MIT License
