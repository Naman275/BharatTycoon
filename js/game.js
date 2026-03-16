/* ============================================
   BHARAT TYCOON — Game Engine
   Complete game logic + sound effects
   ============================================ */

// ---- SOUND ENGINE (Web Audio API) ----
const SFX = {
    ctx: null,
    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    play(type) {
        if (!this.ctx) this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const g = ctx.createGain();
        g.connect(ctx.destination);

        switch(type) {
            case 'dice': {
                for (let i = 0; i < 6; i++) {
                    const o = ctx.createOscillator();
                    o.type = 'square';
                    o.frequency.value = 200 + Math.random() * 400;
                    o.connect(g);
                    g.gain.setValueAtTime(0.08, now + i * 0.05);
                    o.start(now + i * 0.05);
                    o.stop(now + i * 0.05 + 0.04);
                }
                break;
            }
            case 'land': {
                const o = ctx.createOscillator();
                o.type = 'sine';
                o.frequency.setValueAtTime(600, now);
                o.frequency.exponentialRampToValueAtTime(300, now + 0.15);
                g.gain.setValueAtTime(0.12, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                o.connect(g);
                o.start(now);
                o.stop(now + 0.2);
                break;
            }
            case 'buy': {
                [523, 659, 784].forEach((f, i) => {
                    const o = ctx.createOscillator();
                    o.type = 'sine';
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.1, now + i * 0.12);
                    o.connect(g);
                    o.start(now + i * 0.12);
                    o.stop(now + i * 0.12 + 0.1);
                });
                break;
            }
            case 'pay': {
                const o = ctx.createOscillator();
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(400, now);
                o.frequency.exponentialRampToValueAtTime(150, now + 0.3);
                g.gain.setValueAtTime(0.08, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                o.connect(g);
                o.start(now);
                o.stop(now + 0.3);
                break;
            }
            case 'card': {
                const o = ctx.createOscillator();
                o.type = 'triangle';
                o.frequency.setValueAtTime(300, now);
                o.frequency.linearRampToValueAtTime(800, now + 0.2);
                g.gain.setValueAtTime(0.1, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                o.connect(g);
                o.start(now);
                o.stop(now + 0.3);
                break;
            }
            case 'jail': {
                [300, 250, 200].forEach((f, i) => {
                    const o = ctx.createOscillator();
                    o.type = 'square';
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.06, now + i * 0.15);
                    o.connect(g);
                    o.start(now + i * 0.15);
                    o.stop(now + i * 0.15 + 0.12);
                });
                break;
            }
            case 'win': {
                [523, 659, 784, 1047].forEach((f, i) => {
                    const o = ctx.createOscillator();
                    o.type = 'sine';
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.1, now + i * 0.2);
                    o.connect(g);
                    o.start(now + i * 0.2);
                    o.stop(now + i * 0.2 + 0.18);
                });
                break;
            }
            case 'click': {
                const o = ctx.createOscillator();
                o.type = 'sine';
                o.frequency.value = 800;
                g.gain.setValueAtTime(0.06, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                o.connect(g);
                o.start(now);
                o.stop(now + 0.06);
                break;
            }
            case 'build': {
                [400, 500, 600, 800].forEach((f, i) => {
                    const o = ctx.createOscillator();
                    o.type = 'triangle';
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.08, now + i * 0.08);
                    o.connect(g);
                    o.start(now + i * 0.08);
                    o.stop(now + i * 0.08 + 0.07);
                });
                break;
            }
            case 'go': {
                [440, 554, 659, 880].forEach((f, i) => {
                    const o = ctx.createOscillator();
                    o.type = 'sine';
                    o.frequency.value = f;
                    g.gain.setValueAtTime(0.08, now + i * 0.1);
                    o.connect(g);
                    o.start(now + i * 0.1);
                    o.stop(now + i * 0.1 + 0.09);
                });
                break;
            }
        }
    }
};

// ---- PARTICLE SYSTEM ----
const Particles = {
    canvas: null, ctx: null, particles: [],
    init() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    },
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    spawn(x, y, count = 20, colors = ['#FFD700', '#FF8C00', '#FF6B6B']) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 3,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                gravity: 0.1
            });
        }
    },
    confetti(count = 80) {
        const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF8C00', '#E040FB'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -20,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 4 + 2,
                size: Math.random() * 8 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: Math.random() * 0.005 + 0.003,
                gravity: 0.05,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }
    },
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.life -= p.decay;
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            if (p.rotation !== undefined) {
                this.ctx.translate(p.x, p.y);
                p.rotation += p.rotSpeed;
                this.ctx.rotate(p.rotation * Math.PI / 180);
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        });
        requestAnimationFrame(() => this.animate());
    }
};

// ---- BOARD DATA ----
const TOKENS = ['🚗', '🚀', '🎩', '💎'];
const DEFAULT_COLORS = ['#FF4444', '#4488FF', '#44CC44', '#FF8800'];
const AVAILABLE_COLORS = ['#FF4444', '#4488FF', '#44CC44', '#FF8800', '#E040FB', '#00BCD4'];

const BOARD = [
    { name: 'GO', type: 'go' },
    { name: 'Chandni Chowk', type: 'property', color: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250], buildCost: 50, group: 'brown' },
    { name: 'Community Chest', type: 'community' },
    { name: 'Lajpat Nagar', type: 'property', color: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450], buildCost: 50, group: 'brown' },
    { name: 'Income Tax', type: 'tax', amount: 200 },
    { name: 'Mumbai Local', type: 'railroad', price: 200 },
    { name: 'Sarojini Market', type: 'property', color: 'lightblue', price: 100, rent: [6, 30, 90, 270, 400, 550], buildCost: 50, group: 'lightblue' },
    { name: 'Chance', type: 'chance' },
    { name: 'Karol Bagh', type: 'property', color: 'lightblue', price: 100, rent: [6, 30, 90, 270, 400, 550], buildCost: 50, group: 'lightblue' },
    { name: 'Connaught Place', type: 'property', color: 'lightblue', price: 120, rent: [8, 40, 100, 300, 450, 600], buildCost: 50, group: 'lightblue' },
    { name: 'Jail', type: 'jail' },
    { name: 'MG Road BLR', type: 'property', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], buildCost: 100, group: 'pink' },
    { name: 'Tata Power', type: 'utility', price: 150 },
    { name: 'Brigade Road', type: 'property', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], buildCost: 100, group: 'pink' },
    { name: 'Indiranagar', type: 'property', color: 'pink', price: 160, rent: [12, 60, 180, 500, 700, 900], buildCost: 100, group: 'pink' },
    { name: 'Rajdhani Express', type: 'railroad', price: 200 },
    { name: 'Bandra West', type: 'property', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], buildCost: 100, group: 'orange' },
    { name: 'Community Chest', type: 'community' },
    { name: 'Juhu Beach', type: 'property', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], buildCost: 100, group: 'orange' },
    { name: 'Powai', type: 'property', color: 'orange', price: 200, rent: [16, 80, 220, 600, 800, 1000], buildCost: 100, group: 'orange' },
    { name: 'Free Parking', type: 'parking' },
    { name: 'Park Street', type: 'property', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], buildCost: 150, group: 'red' },
    { name: 'Chance', type: 'chance' },
    { name: 'Salt Lake', type: 'property', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], buildCost: 150, group: 'red' },
    { name: 'Howrah Bridge', type: 'property', color: 'red', price: 240, rent: [20, 100, 300, 750, 925, 1100], buildCost: 150, group: 'red' },
    { name: 'Shatabdi Express', type: 'railroad', price: 200 },
    { name: 'Hawa Mahal', type: 'property', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], buildCost: 150, group: 'yellow' },
    { name: 'City Palace', type: 'property', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], buildCost: 150, group: 'yellow' },
    { name: 'Jal Board', type: 'utility', price: 150 },
    { name: 'Amber Fort', type: 'property', color: 'yellow', price: 280, rent: [24, 120, 360, 850, 1025, 1200], buildCost: 150, group: 'yellow' },
    { name: 'Go To Jail', type: 'gotojail' },
    { name: 'Marine Drive', type: 'property', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], buildCost: 200, group: 'green' },
    { name: 'Malabar Hill', type: 'property', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], buildCost: 200, group: 'green' },
    { name: 'Community Chest', type: 'community' },
    { name: 'Nariman Point', type: 'property', color: 'green', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], buildCost: 200, group: 'green' },
    { name: 'Vande Bharat', type: 'railroad', price: 200 },
    { name: 'Chance', type: 'chance' },
    { name: "Lutyens' Delhi", type: 'property', color: 'blue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], buildCost: 200, group: 'blue' },
    { name: 'Luxury Tax', type: 'tax', amount: 100 },
    { name: 'Rashtrapati Bhavan', type: 'property', color: 'blue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], buildCost: 200, group: 'blue' }
];

const CHANCE_CARDS = [
    { text: '🏛️ Advance to GO! Collect ₹200.', action: 'moveTo', value: 0 },
    { text: '💰 Bank pays you dividend of ₹50!', action: 'earn', value: 50 },
    { text: '🔧 Make general repairs. Pay ₹25 per house.', action: 'repairPay', value: 25 },
    { text: '🎉 You won a competition! Collect ₹150.', action: 'earn', value: 150 },
    { text: '👮 Go directly to Jail!', action: 'jail', value: 10 },
    { text: '🏗️ Building loan matures. Collect ₹150.', action: 'earn', value: 150 },
    { text: '📉 Speeding fine! Pay ₹15.', action: 'pay', value: 15 },
    { text: '🎂 It\'s your birthday! Collect ₹100 from the bank.', action: 'earn', value: 100 },
    { text: '⬅️ Go back 3 spaces.', action: 'moveBack', value: 3 },
    { text: '💸 Pay poor tax of ₹15.', action: 'pay', value: 15 }
];

const COMMUNITY_CARDS = [
    { text: '🏦 Bank error in your favor! Collect ₹200.', action: 'earn', value: 200 },
    { text: '🏥 Doctor\'s fees. Pay ₹50.', action: 'pay', value: 50 },
    { text: '📈 From sale of stock, you get ₹50.', action: 'earn', value: 50 },
    { text: '👮 Go to Jail directly!', action: 'jail', value: 10 },
    { text: '🎓 School fees. Pay ₹50.', action: 'pay', value: 50 },
    { text: '💼 Consultancy fee received! Collect ₹25.', action: 'earn', value: 25 },
    { text: '🏠 Life insurance matures. Collect ₹100.', action: 'earn', value: 100 },
    { text: '🏥 Hospital fees. Pay ₹100.', action: 'pay', value: 100 },
    { text: '🎊 You inherit ₹100!', action: 'earn', value: 100 },
    { text: '🏛️ Advance to GO! Collect ₹200.', action: 'moveTo', value: 0 }
];

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const DICE_DOTS = {
    1: [4],
    2: [2, 6],
    3: [2, 4, 6],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
};

// Value to face mapping: 1=front, 2=right, 3=back, 4=left, 5=top, 6=bottom
const DICE_SHOW_CLASS = { 1: 'show-1', 2: 'show-2', 3: 'show-3', 4: 'show-4', 5: 'show-5', 6: 'show-6' };

function initDiceFaces(diceEl) {
    const faces = diceEl.querySelectorAll('.dice__face');
    const faceValues = [1, 3, 2, 4, 5, 6]; // front, back, right, left, top, bottom
    faces.forEach((face, i) => {
        face.innerHTML = '';
        const val = faceValues[i];
        face.dataset.value = val;
        for (let d = 0; d < 9; d++) {
            const dot = document.createElement('div');
            dot.className = 'dice-dot' + (DICE_DOTS[val].includes(d) ? ' active' : '');
            face.appendChild(dot);
        }
    });
}

function setDiceFace(diceEl, value) {
    // Remove all show classes
    Object.values(DICE_SHOW_CLASS).forEach(c => diceEl.classList.remove(c));
    diceEl.classList.add(DICE_SHOW_CLASS[value]);
}

// ---- GAME STATE ----
let game = {
    players: [],
    currentPlayer: 0,
    round: 1,
    phase: 'roll', // roll, action, end
    doublesCount: 0,
    isAnimating: false
};

// ---- DOM REFS ----
const $ = id => document.getElementById(id);

// ---- HELPER FUNCTIONS ----
function toast(icon, text, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-icon">${icon}</span><span>${text}</span>`;
    $('toastContainer').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function moneyFloat(amount, positive) {
    const el = document.createElement('div');
    el.className = `money-float ${positive ? 'positive' : 'negative'}`;
    el.textContent = `${positive ? '+' : '-'}₹${Math.abs(amount)}`;
    const panel = document.querySelector(`.player-panel[data-player="${game.currentPlayer}"]`);
    if (panel) {
        const rect = panel.getBoundingClientRect();
        el.style.left = rect.left + rect.width / 2 + 'px';
        el.style.top = rect.top + 'px';
    } else {
        el.style.left = '50%'; el.style.top = '50%';
    }
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

function showPopup(icon, title, text, details, buttons) {
    $('popupIcon').textContent = icon;
    $('popupTitle').textContent = title;
    $('popupText').textContent = text;
    $('popupDetails').innerHTML = details || '';
    
    const btnContainer = $('popupButtons');
    btnContainer.innerHTML = '';
    buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = `popup-btn ${b.class || ''}`;
        btn.textContent = b.text;
        btn.onclick = () => {
            $('popupOverlay').classList.remove('active');
            SFX.play('click');
            if (b.action) b.action();
        };
        btnContainer.appendChild(btn);
    });
    
    $('popupOverlay').classList.add('active');
}

function showCard(type, card) {
    $('cardType').textContent = type;
    $('cardIcon').textContent = type === 'CHANCE' ? '❓' : '🃏';
    $('cardText').textContent = card.text;
    
    const overlay = $('cardOverlay');
    const cardEl = overlay.querySelector('.chance-card');
    cardEl.style.background = type === 'CHANCE' 
        ? 'linear-gradient(135deg, #FF8C00, #FF6B6B)' 
        : 'linear-gradient(135deg, #2196F3, #00BCD4)';
    
    overlay.classList.add('active');
    SFX.play('card');
    
    setTimeout(() => {
        overlay.classList.remove('active');
        executeCard(card);
    }, 2500);
}

// ---- PLAYER FUNCTIONS ----
function createPlayer(name, index, color) {
    return {
        name: name || `Player ${index + 1}`,
        token: TOKENS[index],
        color: color || DEFAULT_COLORS[index],
        money: 1500,
        position: 0,
        properties: [],
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
        houses: {} // pos -> count (5 = hotel)
    };
}

function currentPlayerObj() {
    return game.players[game.currentPlayer];
}

function updatePlayerPanel(index) {
    const p = game.players[index];
    const panel = document.querySelector(`.player-panel[data-player="${index}"]`);
    if (!panel) return;
    
    panel.querySelector('.panel-money').textContent = `₹${p.money}`;
    
    const propsDiv = panel.querySelector('.panel-props');
    propsDiv.innerHTML = '';
    p.properties.forEach(pos => {
        const cell = BOARD[pos];
        if (cell.color) {
            const dot = document.createElement('div');
            dot.className = 'prop-dot';
            dot.style.background = `var(--${cell.color})`;
            propsDiv.appendChild(dot);
        }
    });
    
    panel.classList.toggle('active', index === game.currentPlayer);
    panel.classList.toggle('bankrupt', p.bankrupt);
}

function updateAllPanels() {
    game.players.forEach((_, i) => updatePlayerPanel(i));
}

// ---- BOARD RENDERING ----
function renderTokens() {
    // Clear all token containers & cell highlights
    document.querySelectorAll('.tokens-container').forEach(tc => tc.innerHTML = '');
    document.querySelectorAll('.cell.has-player').forEach(c => c.classList.remove('has-player'));
    
    // Place each player's token as a colored circle with their initial
    game.players.forEach((p, i) => {
        if (p.bankrupt) return;
        const container = document.querySelector(`.tokens-container[data-pos="${p.position}"]`);
        if (container) {
            const tok = document.createElement('div');
            tok.className = 'board-token';
            tok.textContent = p.name.charAt(0).toUpperCase();
            tok.style.setProperty('--token-color', p.color);
            tok.title = p.name;
            container.appendChild(tok);
            
            // Highlight the cell
            const cell = container.closest('.cell');
            if (cell) cell.classList.add('has-player');
        }
    });
}

function renderHouses() {
    document.querySelectorAll('.house-container').forEach(hc => hc.innerHTML = '');
    
    game.players.forEach(p => {
        Object.entries(p.houses).forEach(([pos, count]) => {
            const container = document.querySelector(`.house-container[data-pos="${pos}"]`);
            if (container) {
                if (count === 5) {
                    container.innerHTML = '<span class="house-icon">🏨</span>';
                } else {
                    for (let i = 0; i < count; i++) {
                        const h = document.createElement('span');
                        h.className = 'house-icon';
                        h.textContent = '🏠';
                        container.appendChild(h);
                    }
                }
            }
        });
    });
}

function updateOwnedCells() {
    // Remove all existing badges and owned class
    document.querySelectorAll('.owner-badge').forEach(b => b.remove());
    document.querySelectorAll('.cell.owned').forEach(c => c.classList.remove('owned'));

    game.players.forEach((p, i) => {
        p.properties.forEach(pos => {
            const cell = document.querySelector(`.cell[data-pos="${pos}"]`);
            if (cell) {
                cell.classList.add('owned');
                cell.style.setProperty('--owner-color', p.color + '90');
                const badge = document.createElement('div');
                badge.className = 'owner-badge';
                badge.textContent = p.name.charAt(0);
                badge.style.background = p.color;
                badge.title = `Owned by ${p.name}`;
                cell.appendChild(badge);
            }
        });
    });
}

// ---- DICE ----
function rollDice() {
    return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
}

function animateDice(d1, d2, callback) {
    const dice1 = $('dice1');
    const dice2 = $('dice2');

    // Remove any previous show classes
    Object.values(DICE_SHOW_CLASS).forEach(c => {
        dice1.classList.remove(c);
        dice2.classList.remove(c);
    });

    // Start 3D rolling
    dice1.classList.add('rolling');
    dice2.classList.add('rolling');
    SFX.play('dice');

    // Let it spin for 1.2 seconds then stop on the result
    setTimeout(() => {
        dice1.classList.remove('rolling');
        dice2.classList.remove('rolling');

        // Show the correct face
        setDiceFace(dice1, d1);
        setDiceFace(dice2, d2);

        SFX.play('land');
        $('diceResult').textContent = `${d1} + ${d2} = ${d1 + d2}${d1 === d2 ? ' 🎯 DOUBLES!' : ''}`;

        const diceArea = $('diceArea').getBoundingClientRect();
        Particles.spawn(diceArea.left + diceArea.width / 2, diceArea.top + diceArea.height / 2, 25, ['#FFD700', '#FF8C00', '#fff']);

        setTimeout(() => callback(d1, d2), 500);
    }, 1200);
}
// ---- MOVEMENT ----
function getCellCenter(pos) {
    const cellEl = document.querySelector(`.cell[data-pos="${pos}"]`);
    if (!cellEl) return null;
    const rect = cellEl.getBoundingClientRect();
    const boardRect = $('gameBoard').getBoundingClientRect();
    return {
        x: rect.left - boardRect.left + rect.width / 2,
        y: rect.top - boardRect.top + rect.height / 2
    };
}

function movePlayer(playerIndex, steps, callback) {
    const p = game.players[playerIndex];
    let moved = 0;
    game.isAnimating = true;

    // Create a floating token for animation
    const board = $('gameBoard');
    const floater = document.createElement('div');
    floater.className = 'board-token moving';
    floater.textContent = p.name.charAt(0).toUpperCase();
    floater.style.setProperty('--token-color', p.color);
    floater.style.position = 'absolute';
    floater.style.zIndex = '50';
    floater.style.transition = 'left 0.25s cubic-bezier(0.4,0,0.2,1), top 0.25s cubic-bezier(0.4,0,0.2,1)';
    floater.style.width = '22px';
    floater.style.height = '26px';
    floater.style.fontSize = '0.6rem';
    floater.style.display = 'flex';
    floater.style.alignItems = 'center';
    floater.style.justifyContent = 'center';
    floater.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%';
    floater.style.border = '2px solid rgba(255,255,255,0.7)';
    floater.style.color = '#fff';
    floater.style.fontWeight = '900';
    floater.style.textShadow = '0 1px 2px rgba(0,0,0,0.5)';

    const startPos = getCellCenter(p.position);
    if (startPos) {
        floater.style.left = (startPos.x - 11) + 'px';
        floater.style.top = (startPos.y - 11) + 'px';
    }
    board.appendChild(floater);

    // Hide the static token for this player during animation
    renderTokens();

    const moveStep = () => {
        if (moved >= steps) {
            game.isAnimating = false;
            floater.remove();
            SFX.play('land');
            renderTokens();
            if (callback) callback();
            return;
        }

        p.position = (p.position + 1) % 40;
        moved++;

        // Passed GO
        if (p.position === 0 && moved < steps) {
            p.money += 200;
            toast('🏁', `${p.name} passed GO! +₹200`, 'positive');
            moneyFloat(200, true);
            SFX.play('go');
            updatePlayerPanel(playerIndex);
        }

        // Leave a fading trail
        const trailPos = getCellCenter((p.position - 1 + 40) % 40);
        if (trailPos) {
            const trail = document.createElement('div');
            trail.className = 'token-trail';
            trail.style.background = p.color;
            trail.style.width = '8px';
            trail.style.height = '8px';
            trail.style.left = (trailPos.x - 4) + 'px';
            trail.style.top = (trailPos.y - 4) + 'px';
            board.appendChild(trail);
            setTimeout(() => trail.remove(), 400);
        }

        // Animate the floater to new cell
        const newPos = getCellCenter(p.position);
        if (newPos) {
            floater.style.left = (newPos.x - 11) + 'px';
            floater.style.top = (newPos.y - 11) + 'px';
        }

        // Play a soft step sound every few cells
        if (moved % 2 === 0) SFX.play('click');

        setTimeout(moveStep, 300);
    };

    setTimeout(moveStep, 150);
}

function movePlayerTo(playerIndex, pos, callback) {
    const p = game.players[playerIndex];
    const currentPos = p.position;
    let steps = pos - currentPos;
    if (steps <= 0) steps += 40;
    movePlayer(playerIndex, steps, callback);
}

// ---- LANDING LOGIC ----
function handleLanding() {
    const p = currentPlayerObj();
    const cell = BOARD[p.position];
    
    switch (cell.type) {
        case 'go':
            toast('🏁', `${p.name} landed on GO! Collect ₹200!`, 'positive');
            p.money += 200;
            moneyFloat(200, true);
            SFX.play('go');
            updateAllPanels();
            showActionBar();
            break;
            
        case 'property':
        case 'railroad':
        case 'utility':
            handlePropertyLanding(cell);
            break;
            
        case 'tax':
            toast('💸', `${p.name} pays ₹${cell.amount} tax!`, 'negative');
            p.money -= cell.amount;
            moneyFloat(cell.amount, false);
            SFX.play('pay');
            updateAllPanels();
            checkBankrupt(game.currentPlayer);
            showActionBar();
            break;
            
        case 'chance':
            handleChance();
            break;
            
        case 'community':
            handleCommunity();
            break;
            
        case 'jail':
            toast('🔒', `${p.name} is just visiting jail.`, 'info');
            showActionBar();
            break;
            
        case 'gotojail':
            goToJail(game.currentPlayer);
            break;
            
        case 'parking':
            toast('🅿️', `${p.name} is relaxing at Free Parking!`, 'info');
            showActionBar();
            break;
    }
}

function handlePropertyLanding(cell) {
    const p = currentPlayerObj();
    const pos = p.position;
    
    // Check if anyone owns it
    const owner = game.players.findIndex(pl => pl.properties.includes(pos));
    
    if (owner === -1) {
        // Unowned — offer to buy
        if (p.money >= cell.price) {
            const details = cell.type === 'property' 
                ? `<div><span>Price</span><span>₹${cell.price}</span></div>
                   <div><span>Base Rent</span><span>₹${cell.rent[0]}</span></div>
                   <div><span>Color</span><span style="text-transform:capitalize">${cell.color}</span></div>
                   <div><span>Build Cost</span><span>₹${cell.buildCost}/house</span></div>`
                : `<div><span>Price</span><span>₹${cell.price}</span></div>`;
            
            showPopup('🏠', `${cell.name}`, `Price: ₹${cell.price}. Buy it?`, details, [
                { text: '✅ Buy', class: 'yes', action: () => buyProperty(pos) },
                { text: '❌ Pass', class: 'no', action: () => showActionBar() }
            ]);
        } else {
            toast('💰', `${p.name} can't afford ${cell.name} (₹${cell.price})`, 'negative');
            showActionBar();
        }
    } else if (owner === game.currentPlayer) {
        toast('🏠', `${p.name} owns ${cell.name}!`, 'info');
        showActionBar();
    } else {
        // Pay rent
        const ownerPlayer = game.players[owner];
        let rentAmount = calculateRent(pos, owner);
        
        toast('💸', `${p.name} pays ₹${rentAmount} rent to ${ownerPlayer.name}!`, 'negative');
        p.money -= rentAmount;
        ownerPlayer.money += rentAmount;
        moneyFloat(rentAmount, false);
        SFX.play('pay');
        updateAllPanels();
        checkBankrupt(game.currentPlayer);
        showActionBar();
    }
}

function calculateRent(pos, ownerIndex) {
    const cell = BOARD[pos];
    const owner = game.players[ownerIndex];
    
    if (cell.type === 'railroad') {
        const railroads = owner.properties.filter(p => BOARD[p].type === 'railroad').length;
        return 25 * Math.pow(2, railroads - 1);
    }
    
    if (cell.type === 'utility') {
        const utils = owner.properties.filter(p => BOARD[p].type === 'utility').length;
        return utils === 2 ? 70 : 28;
    }
    
    // Property
    const houses = owner.houses[pos] || 0;
    return cell.rent[houses];
}

function buyProperty(pos) {
    const p = currentPlayerObj();
    const cell = BOARD[pos];
    
    p.money -= cell.price;
    p.properties.push(pos);
    
    toast('🎉', `${p.name} bought ${cell.name}!`, 'positive');
    moneyFloat(cell.price, false);
    SFX.play('buy');
    
    Particles.spawn(window.innerWidth / 2, window.innerHeight / 2, 30, ['#4CAF50', '#FFD700', '#FF8C00']);
    
    updateAllPanels();
    updateOwnedCells();
    renderTokens();
    showActionBar();
}

function buildHouse() {
    const p = currentPlayerObj();
    
    // Find properties where player can build
    const buildable = p.properties.filter(pos => {
        const cell = BOARD[pos];
        if (cell.type !== 'property') return false;
        
        // Check if player owns all in group
        const groupProps = BOARD.reduce((acc, c, i) => {
            if (c.group === cell.group) acc.push(i);
            return acc;
        }, []);
        
        const ownsAll = groupProps.every(gp => p.properties.includes(gp));
        if (!ownsAll) return false;
        
        const houses = p.houses[pos] || 0;
        return houses < 5 && p.money >= cell.buildCost;
    });
    
    if (buildable.length === 0) {
        toast('🏗️', 'No properties available to build on!', 'info');
        return;
    }
    
    // Build on first available (simplified)
    const pos = buildable[0];
    const cell = BOARD[pos];
    p.houses[pos] = (p.houses[pos] || 0) + 1;
    p.money -= cell.buildCost;
    
    const type = p.houses[pos] === 5 ? 'Hotel 🏨' : `House ${p.houses[pos]} 🏠`;
    toast('🏗️', `${p.name} built ${type} on ${cell.name}!`, 'positive');
    moneyFloat(cell.buildCost, false);
    SFX.play('build');
    
    Particles.spawn(window.innerWidth / 2, window.innerHeight / 2, 20, ['#2196F3', '#4CAF50']);
    
    updateAllPanels();
    renderHouses();
}

// ---- CHANCE & COMMUNITY ----
function handleChance() {
    const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    showCard('CHANCE', card);
}

function handleCommunity() {
    const card = COMMUNITY_CARDS[Math.floor(Math.random() * COMMUNITY_CARDS.length)];
    showCard('COMMUNITY', card);
}

function executeCard(card) {
    const p = currentPlayerObj();
    
    switch (card.action) {
        case 'earn':
            p.money += card.value;
            moneyFloat(card.value, true);
            SFX.play('buy');
            toast('💰', `${p.name} received ₹${card.value}!`, 'positive');
            break;
        case 'pay':
            p.money -= card.value;
            moneyFloat(card.value, false);
            SFX.play('pay');
            toast('💸', `${p.name} paid ₹${card.value}!`, 'negative');
            break;
        case 'moveTo':
            movePlayerTo(game.currentPlayer, card.value, handleLanding);
            return;
        case 'moveBack':
            p.position = (p.position - card.value + 40) % 40;
            renderTokens();
            SFX.play('land');
            handleLanding();
            return;
        case 'jail':
            goToJail(game.currentPlayer);
            return;
        case 'repairPay':
            const totalHouses = Object.values(p.houses).reduce((sum, h) => sum + h, 0);
            const repairCost = totalHouses * card.value;
            p.money -= repairCost;
            moneyFloat(repairCost, false);
            SFX.play('pay');
            toast('🔧', `${p.name} paid ₹${repairCost} for repairs!`, 'negative');
            break;
    }
    
    updateAllPanels();
    checkBankrupt(game.currentPlayer);
    showActionBar();
}

// ---- JAIL ----
function goToJail(playerIndex) {
    const p = game.players[playerIndex];
    p.position = 10;
    p.inJail = true;
    p.jailTurns = 0;
    
    toast('👮', `${p.name} goes to JAIL!`, 'negative');
    SFX.play('jail');
    renderTokens();
    
    setTimeout(() => showActionBar(), 1000);
}

function handleJailTurn() {
    const p = currentPlayerObj();
    
    if (p.jailTurns >= 3) {
        // Must pay and get out
        p.money -= 50;
        p.inJail = false;
        p.jailTurns = 0;
        moneyFloat(50, false);
        toast('🔓', `${p.name} paid ₹50 bail and is free!`, 'info');
        SFX.play('pay');
        updateAllPanels();
        return true; // Can roll normally
    }
    
    showPopup('🔒', 'You\'re in Jail!', `Turn ${p.jailTurns + 1}/3. Pay ₹50 to get out or try rolling doubles.`, '', [
        { text: '💰 Pay ₹50', class: 'yes', action: () => {
            p.money -= 50;
            p.inJail = false;
            p.jailTurns = 0;
            moneyFloat(50, false);
            SFX.play('pay');
            updateAllPanels();
            game.phase = 'roll';
            $('rollBtn').disabled = false;
        }},
        { text: '🎲 Roll Doubles', class: 'no', action: () => {
            const [d1, d2] = rollDice();
            animateDice(d1, d2, () => {
                if (d1 === d2) {
                    p.inJail = false;
                    p.jailTurns = 0;
                    toast('🎯', `${p.name} rolled doubles and is FREE!`, 'positive');
                    SFX.play('buy');
                    movePlayer(game.currentPlayer, d1 + d2, handleLanding);
                } else {
                    p.jailTurns++;
                    toast('🔒', `No doubles. Still in jail. (${p.jailTurns}/3)`, 'negative');
                    nextTurn();
                }
            });
        }}
    ]);
    
    return false;
}

// ---- BANKRUPTCY ----
function checkBankrupt(playerIndex) {
    const p = game.players[playerIndex];
    if (p.money < 0) {
        p.bankrupt = true;
        p.properties = [];
        p.houses = {};
        toast('💀', `${p.name} is BANKRUPT!`, 'negative');
        SFX.play('jail');
        updateAllPanels();
        updateOwnedCells();
        renderHouses();
        
        // Check win condition
        const alive = game.players.filter(pl => !pl.bankrupt);
        if (alive.length === 1) {
            endGame(alive[0]);
        }
    }
}

// ---- TURN MANAGEMENT ----
function showActionBar() {
    const p = currentPlayerObj();
    const bar = $('actionBar');
    bar.style.display = 'flex';
    
    // Buy button — only if on unowned property
    const cell = BOARD[p.position];
    const isUnowned = ['property', 'railroad', 'utility'].includes(cell.type) && 
                       !game.players.some(pl => pl.properties.includes(p.position));
    $('buyBtn').style.display = isUnowned && p.money >= cell.price ? 'block' : 'none';
    
    // Build button
    const canBuild = p.properties.some(pos => {
        const c = BOARD[pos];
        if (c.type !== 'property') return false;
        const groupProps = BOARD.reduce((acc, cc, i) => { if (cc.group === c.group) acc.push(i); return acc; }, []);
        return groupProps.every(gp => p.properties.includes(gp)) && (p.houses[pos] || 0) < 5 && p.money >= c.buildCost;
    });
    $('buildBtn').style.display = canBuild ? 'block' : 'none';
    
    game.phase = 'action';
}

function nextTurn() {
    $('actionBar').style.display = 'none';
    
    do {
        game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
    } while (game.players[game.currentPlayer].bankrupt);
    
    if (game.currentPlayer === 0) {
        game.round++;
        $('roundCounter').textContent = `R${game.round}`;
    }
    
    const p = currentPlayerObj();
    const turnTok = $('turnIndicator').querySelector('.turn-token');
    turnTok.textContent = p.name.charAt(0);
    turnTok.style.cssText = `background:${p.color};color:#fff;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:800;border:2px solid #fff;box-shadow:0 0 10px ${p.color}80;`;
    $('turnIndicator').querySelector('.turn-name').textContent = `${p.name}'s Turn`;
    
    game.phase = 'roll';
    game.doublesCount = 0;
    $('rollBtn').disabled = false;
    $('diceResult').textContent = '';
    
    updateAllPanels();
    
    // Check if in jail
    if (p.inJail) {
        $('rollBtn').disabled = true;
        setTimeout(() => handleJailTurn(), 500);
    }
}

// ---- END GAME ----
function endGame(winner) {
    setTimeout(() => {
        SFX.play('win');
        Particles.confetti(150);
        
        $('gameScreen').classList.remove('active');
        $('winScreen').classList.add('active');
        $('winTitle').textContent = `${winner.name} WINS!`;
        
        $('winStats').innerHTML = `
            <div class="win-stat">
                <div class="win-stat-val">₹${winner.money}</div>
                <div class="win-stat-label">Total Cash</div>
            </div>
            <div class="win-stat">
                <div class="win-stat-val">${winner.properties.length}</div>
                <div class="win-stat-label">Properties</div>
            </div>
            <div class="win-stat">
                <div class="win-stat-val">${Object.values(winner.houses).reduce((a, b) => a + b, 0)}</div>
                <div class="win-stat-label">Buildings</div>
            </div>
        `;
        
        // Continuous confetti
        const confettiInterval = setInterval(() => Particles.confetti(30), 2000);
        setTimeout(() => clearInterval(confettiInterval), 20000);
    }, 1500);
}

// ---- CELL INFO POPUP ----
function showCellInfo(pos, evt) {
    // Remove existing popup
    const existing = document.querySelector('.cell-info-popup');
    if (existing) existing.remove();

    const cell = BOARD[pos];
    const popup = document.createElement('div');
    popup.className = 'cell-info-popup';

    let html = '';

    if (cell.type === 'property') {
        const owner = game.players.findIndex(pl => pl.properties.includes(pos));
        const ownerP = owner >= 0 ? game.players[owner] : null;
        const houses = ownerP ? (ownerP.houses[pos] || 0) : 0;

        html = `<div class="cip-header">
            <div class="cip-color-dot" style="background:var(--${cell.color})"></div>
            <div class="cip-name">${cell.name}</div>
            <button class="cip-close" onclick="this.closest('.cell-info-popup').remove()">&times;</button>
        </div>
        <div class="cip-row"><span>Price</span><span>₹${cell.price}</span></div>
        <div class="cip-row"><span>Rent (no houses)</span><span>₹${cell.rent[0]}</span></div>
        <div class="cip-row"><span>Rent (1 house)</span><span>₹${cell.rent[1]}</span></div>
        <div class="cip-row"><span>Rent (2 houses)</span><span>₹${cell.rent[2]}</span></div>
        <div class="cip-row"><span>Rent (3 houses)</span><span>₹${cell.rent[3]}</span></div>
        <div class="cip-row"><span>Rent (4 houses)</span><span>₹${cell.rent[4]}</span></div>
        <div class="cip-row"><span>Rent (Hotel)</span><span>₹${cell.rent[5]}</span></div>
        <div class="cip-row"><span>House Cost</span><span>₹${cell.buildCost}</span></div>
        <div class="cip-row"><span>Houses Built</span><span>${houses === 5 ? '🏨 Hotel' : '🏠 ' + houses}</span></div>`;
        if (ownerP) {
            html += `<div class="cip-owner"><div class="cip-owner-dot" style="background:${ownerP.color}"></div>Owned by ${ownerP.name}</div>`;
        } else {
            html += `<div class="cip-owner">🏷️ Not owned</div>`;
        }
    } else if (cell.type === 'railroad') {
        const owner = game.players.findIndex(pl => pl.properties.includes(pos));
        const ownerP = owner >= 0 ? game.players[owner] : null;
        html = `<div class="cip-header">
            <div class="cip-name">🚂 ${cell.name}</div>
            <button class="cip-close" onclick="this.closest('.cell-info-popup').remove()">&times;</button>
        </div>
        <div class="cip-row"><span>Price</span><span>₹${cell.price}</span></div>
        <div class="cip-row"><span>Rent (1 RR)</span><span>₹25</span></div>
        <div class="cip-row"><span>Rent (2 RR)</span><span>₹50</span></div>
        <div class="cip-row"><span>Rent (3 RR)</span><span>₹100</span></div>
        <div class="cip-row"><span>Rent (4 RR)</span><span>₹200</span></div>`;
        if (ownerP) {
            html += `<div class="cip-owner"><div class="cip-owner-dot" style="background:${ownerP.color}"></div>Owned by ${ownerP.name}</div>`;
        } else {
            html += `<div class="cip-owner">🏷️ Not owned</div>`;
        }
    } else if (cell.type === 'utility') {
        const owner = game.players.findIndex(pl => pl.properties.includes(pos));
        const ownerP = owner >= 0 ? game.players[owner] : null;
        html = `<div class="cip-header">
            <div class="cip-name">${pos === 12 ? '⚡' : '💧'} ${cell.name}</div>
            <button class="cip-close" onclick="this.closest('.cell-info-popup').remove()">&times;</button>
        </div>
        <div class="cip-row"><span>Price</span><span>₹${cell.price}</span></div>
        <div class="cip-row"><span>Rent (1 util)</span><span>₹28</span></div>
        <div class="cip-row"><span>Rent (2 utils)</span><span>₹70</span></div>`;
        if (ownerP) {
            html += `<div class="cip-owner"><div class="cip-owner-dot" style="background:${ownerP.color}"></div>Owned by ${ownerP.name}</div>`;
        } else {
            html += `<div class="cip-owner">🏷️ Not owned</div>`;
        }
    } else if (cell.type === 'tax') {
        html = `<div class="cip-header">
            <div class="cip-name">💸 ${cell.name}</div>
            <button class="cip-close" onclick="this.closest('.cell-info-popup').remove()">&times;</button>
        </div>
        <div class="cip-special"><div class="cip-icon">💸</div>Pay ₹${cell.amount}</div>`;
    } else {
        const icons = { go: '🏁', jail: '🔒', parking: '🅿️', gotojail: '👮', chance: '❓', community: '🃏' };
        const descs = { go: 'Collect ₹200 when you pass or land here', jail: 'Just visiting! (or stuck if sent here)', parking: 'Rest here. Nothing happens.', gotojail: 'Go directly to Jail!', chance: 'Draw a Chance card', community: 'Draw a Community Chest card' };
        html = `<div class="cip-header">
            <div class="cip-name">${icons[cell.type] || ''} ${cell.name}</div>
            <button class="cip-close" onclick="this.closest('.cell-info-popup').remove()">&times;</button>
        </div>
        <div class="cip-special"><div class="cip-icon">${icons[cell.type] || '📍'}</div>${descs[cell.type] || ''}</div>`;
    }

    popup.innerHTML = html;
    document.body.appendChild(popup);

    // Position near the click
    const x = Math.min(evt.clientX, window.innerWidth - 290);
    const y = Math.min(evt.clientY, window.innerHeight - popup.offsetHeight - 10);
    popup.style.left = Math.max(10, x) + 'px';
    popup.style.top = Math.max(10, y) + 'px';

    // Close on outside click
    setTimeout(() => {
        const closer = (e) => {
            if (!popup.contains(e.target)) { popup.remove(); document.removeEventListener('click', closer); }
        };
        document.addEventListener('click', closer);
    }, 100);

    SFX.play('click');
}

// ---- INITIALIZATION ----
function initGame() {
    Particles.init();

    // Cell click to show info
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', (e) => {
            // Don't show info during animation
            if (game.isAnimating) return;
            // Don't show if popup/overlay is active
            if (document.querySelector('.popup-overlay.active') || document.querySelector('.card-overlay.active')) return;
            const pos = parseInt(cell.dataset.pos);
            if (!isNaN(pos)) showCellInfo(pos, e);
        });
    });
    
    // Init 3D dice
    initDiceFaces($('dice1'));
    initDiceFaces($('dice2'));
    setDiceFace($('dice1'), 1);
    setDiceFace($('dice2'), 1);

    // Init color pickers on default setup
    initColorPickers();

    // Player count selector
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            SFX.play('click');
            document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const count = parseInt(btn.dataset.count);
            const container = $('playerNames');
            container.innerHTML = '';
            
            for (let i = 0; i < count; i++) {
                const div = document.createElement('div');
                div.className = 'player-input';
                div.dataset.player = i;
                const colorOptions = AVAILABLE_COLORS.map((c, ci) => 
                    `<div class="color-opt ${ci === i ? 'active' : ''}" data-color="${c}" style="background:${c}"></div>`
                ).join('');
                div.innerHTML = `
                    <span class="token-preview">${TOKENS[i]}</span>
                    <input type="text" placeholder="Player ${i + 1}" maxlength="12">
                    <div class="color-picker" data-player="${i}">${colorOptions}</div>
                `;
                container.appendChild(div);
            }
            initColorPickers();
        });
    });
    
    // Start button
    $('startBtn').addEventListener('click', () => {
        SFX.play('click');
        
        const inputs = document.querySelectorAll('.player-input');
        game.players = [];
        
        inputs.forEach((inp, i) => {
            const name = inp.querySelector('input').value.trim() || `Player ${i + 1}`;
            const activeColor = inp.querySelector('.color-opt.active');
            const color = activeColor ? activeColor.dataset.color : DEFAULT_COLORS[i];
            game.players.push(createPlayer(name, i, color));
        });
        
        startGame();
    });
    
    // Roll button
    $('rollBtn').addEventListener('click', () => {
        if (game.phase !== 'roll' || game.isAnimating) return;
        $('rollBtn').disabled = true;
        game.isAnimating = true;
        
        const [d1, d2] = rollDice();
        
        animateDice(d1, d2, (d1, d2) => {
            const total = d1 + d2;
            const isDoubles = d1 === d2;
            
            if (isDoubles) {
                game.doublesCount++;
                if (game.doublesCount >= 3) {
                    toast('👮', `${currentPlayerObj().name} rolled 3 doubles — GO TO JAIL!`, 'negative');
                    goToJail(game.currentPlayer);
                    nextTurn();
                    return;
                }
            }
            
            movePlayer(game.currentPlayer, total, () => {
                handleLanding();
            });
        });
    });
    
    // Action buttons
    $('buyBtn').addEventListener('click', () => {
        const p = currentPlayerObj();
        buyProperty(p.position);
    });
    
    $('buildBtn').addEventListener('click', () => {
        buildHouse();
    });
    
    $('endTurnBtn').addEventListener('click', () => {
        SFX.play('click');
        nextTurn();
    });
}

function initColorPickers() {
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.querySelectorAll('.color-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                SFX.play('click');
                // Deselect all in this picker
                picker.querySelectorAll('.color-opt').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                
                // Update token preview border color
                const playerInput = picker.closest('.player-input');
                const preview = playerInput.querySelector('.token-preview');
                preview.style.filter = `drop-shadow(0 0 6px ${opt.dataset.color})`;
                
                // Mark taken colors across all pickers
                updateTakenColors();
            });
        });
    });
    updateTakenColors();
}

function updateTakenColors() {
    const pickers = document.querySelectorAll('.color-picker');
    const chosen = [];
    pickers.forEach(p => {
        const active = p.querySelector('.color-opt.active');
        if (active) chosen.push({ player: p.dataset.player, color: active.dataset.color });
    });
    
    pickers.forEach(p => {
        const myActive = p.querySelector('.color-opt.active');
        const myColor = myActive ? myActive.dataset.color : null;
        p.querySelectorAll('.color-opt').forEach(opt => {
            const isTaken = chosen.some(c => c.color === opt.dataset.color && c.player !== p.dataset.player);
            opt.classList.toggle('taken', isTaken);
        });
    });
}

function startGame() {
    $('startScreen').classList.remove('active');
    $('gameScreen').classList.add('active');
    
    // Create player panels
    const panelsContainer = $('playerPanels');
    panelsContainer.innerHTML = '';
    
    game.players.forEach((p, i) => {
        const panel = document.createElement('div');
        panel.className = `player-panel ${i === 0 ? 'active' : ''}`;
        panel.dataset.player = i;
        panel.innerHTML = `
            <span class="panel-token" style="background:${p.color};color:#fff;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:0.6rem;border:2px solid #fff;box-shadow:0 0 6px ${p.color}60;flex-shrink:0;">${p.name.charAt(0)}</span>
            <span class="panel-money">₹${p.money}</span>
            <div class="panel-props"></div>
        `;
        panelsContainer.appendChild(panel);
    });
    
    // Set first player
    const first = currentPlayerObj();
    const turnToken = $('turnIndicator').querySelector('.turn-token');
    turnToken.textContent = first.name.charAt(0);
    turnToken.style.cssText = `background:${first.color};color:#fff;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:800;border:2px solid #fff;box-shadow:0 0 10px ${first.color}80;`;
    $('turnIndicator').querySelector('.turn-name').textContent = `${first.name}'s Turn`;
    
    renderTokens();
    
    Particles.spawn(window.innerWidth / 2, window.innerHeight / 2, 40, ['#FFD700', '#FF8C00']);
    SFX.play('go');
    
    toast('🎮', 'Game Started! Roll the dice!', 'positive');
}

// Start
document.addEventListener('DOMContentLoaded', initGame);
