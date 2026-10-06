const companies = [
  { name: 'Acme Labs', industry: 'Biotech', celebrity: 'Snoop Dogg', revenue: 320, valuation: 5400 },
  { name: 'Northstar Retail', industry: 'Retail', celebrity: 'David Beckham', revenue: 280, valuation: 2100 },
  { name: 'Bluepeak Foods', industry: 'Food & Beverage', celebrity: 'Gordon Ramsay', revenue: 410, valuation: 3900 },
  { name: 'Summit Cloud', industry: 'Software', celebrity: 'Elon Musk', revenue: 760, valuation: 11000 },
  { name: 'Harbor Logistics', industry: 'Logistics', celebrity: 'Dwayne Johnson', revenue: 510, valuation: 6700 },
  { name: 'Silverline AI', industry: 'AI', celebrity: 'MrBeast', revenue: 880, valuation: 22400 },
  { name: 'Maple Ventures', industry: 'Finance', celebrity: 'Kevin OLeary', revenue: 190, valuation: 900 },
  { name: 'Crestline Energy', industry: 'Energy', celebrity: 'Arnold Schwarzenegger', revenue: 630, valuation: 9800 },
  { name: 'Brightlane Media', industry: 'Media', celebrity: 'Kim Kardashian', revenue: 260, valuation: 1800 },
  { name: 'Quarry Systems', industry: 'Manufacturing', celebrity: 'The Rock', revenue: 700, valuation: 8600 },
  { name: 'Greenstone Solar', industry: 'Clean Energy', celebrity: 'Will Smith', revenue: 440, valuation: 4700 },
  { name: 'Beacon Health', industry: 'Healthcare', celebrity: 'Dr. Dre', revenue: 360, valuation: 5200 },
  { name: 'Pine & Co.', industry: 'Construction', celebrity: 'Ryan Reynolds', revenue: 235, valuation: 1500 },
  { name: 'Signal Robotics', industry: 'Robotics', celebrity: 'Steve Jobs', revenue: 620, valuation: 9900 },
  { name: 'Aster Digital', industry: 'Marketing', celebrity: 'Kylie Jenner', revenue: 310, valuation: 2700 },
  { name: 'Vantage Mining', industry: 'Mining', celebrity: 'Jay-Z', revenue: 560, valuation: 7400 }
];

const scoreEl = document.getElementById('score');
const bestStreakEl = document.getElementById('best-streak');
const roundEl = document.getElementById('round');
const promptText = document.getElementById('prompt-text');
const feedbackEl = document.getElementById('feedback');

const leftNameEl = document.getElementById('left-name');
const leftIndustryEl = document.getElementById('left-industry');
const leftValueEl = document.getElementById('left-value');

const rightNameEl = document.getElementById('right-name');
const rightIndustryEl = document.getElementById('right-industry');
const rightValueEl = document.getElementById('right-value');

const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const newGameBtn = document.getElementById('new-game-btn');

const state = {
  score: 0,
  bestStreak: 0,
  currentStreak: 0,
  round: 1,
  leftCompany: null,
  rightCompany: null,
  metric: 'revenue',
  answerLocked: false
};

function formatMoney(value) {
  return `$${value.toLocaleString()}M`;
}

function getRandomCompany(exclude = []) {
  const options = companies.filter((company) => !exclude.includes(company.name));
  return options[Math.floor(Math.random() * options.length)];
}

function updateStats() {
  scoreEl.textContent = state.score;
  bestStreakEl.textContent = state.bestStreak;
  roundEl.textContent = state.round;
}

function renderRound() {
  if (!state.leftCompany || !state.rightCompany) return;

  const leftOwner = state.leftCompany.celebrity;
  const rightOwner = state.rightCompany.celebrity;

  leftNameEl.textContent = state.leftCompany.name;
  leftIndustryEl.textContent = state.leftCompany.industry;
  leftValueEl.textContent = leftOwner;

  rightNameEl.textContent = state.rightCompany.name;
  rightIndustryEl.textContent = state.rightCompany.industry;
  rightValueEl.textContent = rightOwner;

  promptText.textContent = 'Which business has the higher annual revenue?';

  feedbackEl.textContent = 'Guess which company is bigger based on the owner names.';
  feedbackEl.classList.remove('success', 'error');
}

function initializeRound() {
  state.leftCompany = getRandomCompany();
  state.rightCompany = getRandomCompany([state.leftCompany.name]);
  state.answerLocked = false;
  renderRound();
}

function resetGame() {
  state.score = 0;
  state.bestStreak = 0;
  state.currentStreak = 0;
  state.round = 1;
  initializeRound();
  updateStats();
}

function handleGuess(guess) {
  if (state.answerLocked) return;

  const leftValue = state.leftCompany[state.metric];
  const rightValue = state.rightCompany[state.metric];
  const correctAnswer = rightValue > leftValue ? 'higher' : 'lower';

  state.answerLocked = true;

  const isCorrect = guess === correctAnswer;

  if (isCorrect) {
    state.score += 1;
    state.currentStreak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
    feedbackEl.textContent = `Correct — ${state.rightCompany.name} is ${rightValue > leftValue ? 'higher' : 'lower'} in ${state.metric}.`;
    feedbackEl.classList.add('success');
  } else {
    state.currentStreak = 0;
    feedbackEl.textContent = `Not quite — ${state.rightCompany.name} is ${rightValue > leftValue ? 'higher' : 'lower'} in ${state.metric}.`;
    feedbackEl.classList.add('error');
  }

  updateStats();

  setTimeout(() => {
    state.round += 1;
    state.leftCompany = state.rightCompany;
    state.rightCompany = getRandomCompany([state.leftCompany.name]);
    if (state.rightCompany === undefined) {
      state.rightCompany = getRandomCompany();
    }
    state.answerLocked = false;
    renderRound();
    updateStats();
  }, 1200);
}

higherBtn.addEventListener('click', () => handleGuess('higher'));
lowerBtn.addEventListener('click', () => handleGuess('lower'));
newGameBtn.addEventListener('click', resetGame);

resetGame();
