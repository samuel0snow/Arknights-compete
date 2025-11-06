document.addEventListener("DOMContentLoaded", () => {
  // ====== 角色技能数据 ======
  const characters = [
    { 
      id: 1, name: "丰川祥子", img: "source\characters\立绘_丰川祥子_1.png", hp: 10, 物理伤害: 10, 法术伤害: 10, 物理抗性: 10, 法术抗性: 10, 
      skills: [
        { name: "提升攻击力", effect: "增加", value: 5, turns: 2 }, // 技能1
        { name: "提升防御力", effect: "增加", value: 5, turns: 3 }, // 技能2
        { name: "降低敌人攻击力", effect: "减少", value: 3, turns: 1 } // 技能3
      ],
      activeSkill: null, // 当前启用的技能
    },
    { 
      id: 2, name: "缄默德克萨斯", img: "source\characters\立绘_缄默德克萨斯_1.png", hp: 10, 物理伤害: 10, 法术伤害: 10, 物理抗性: 10, 法术抗性: 10, 
      skills: [
        { name: "提升攻击力", effect: "增加", value: 5, turns: 2 },
        { name: "提升防御力", effect: "增加", value: 5, turns: 3 },
        { name: "降低敌人攻击力", effect: "减少", value: 3, turns: 1 }
      ],
      activeSkill: null,
    }
  ];

  const enemies = [
    { id: 1, img: "source\enemies\源石虫·α.png", hp: 3, 物理伤害: 2, 法术伤害: 2, 物理抗性: 2, 法术抗性: 2 },
    { id: 2, img: "source\enemies\源石虫β.png", hp: 2, 物理伤害: 3, 法术伤害: 1, 物理抗性: 1, 法术抗性: 3 }
  ];

  // ====== 渲染角色、敌人、战斗界面 ======
  function renderBattleChars() {
    const container = document.getElementById('battleCharacters');
    container.innerHTML = '';
    battleChars.forEach(c => {
      const div = document.createElement('div');
      div.className = 'battle-char';
      div.innerHTML = `<img src="${c.img}" alt="${c.name}"><p>${c.name}：${Math.max(0, c.currentHp)}</p>`;
      container.appendChild(div);
    });
  }

  function renderBattleEnemies() {
    const container = document.getElementById('battleEnemies');
    container.innerHTML = '';
    battleEnemies.forEach(e => {
      const div = document.createElement('div');
      div.className = 'battle-enemy';
      div.innerHTML = `<img src="${e.img}" alt="敌人"><p>血量：${Math.max(0, e.currentHp)}</p>`;
      container.appendChild(div);
    });
  }

  // ====== 战斗选择与技能逻辑 ======
  let battleChars = [];
  let battleEnemies = [];
  let selectedChar = null;
  const battleLog = document.getElementById('battleLog');

  // 开始战斗
  document.getElementById('startBattle').addEventListener('click', () => {
    battleChars = [];
    battleEnemies = [];
    selectedChar = null;
    battleLog.innerHTML = '';

    // 随机选择角色与敌人
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * characters.length);
      const char = { ...characters[idx], currentHp: characters[idx].hp };
      battleChars.push(char);
    }

    // 随机选择敌人
    const enemyCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < enemyCount; i++) {
      const idx = Math.floor(Math.random() * enemies.length);
      const enemy = { ...enemies[idx], currentHp: enemies[idx].hp };
      battleEnemies.push(enemy);
    }

    renderBattleChars();
    renderBattleEnemies();
    battleLog.innerHTML = "<p>战斗开始！请选择角色和技能！</p>";
  });

  // 技能选择
  document.getElementById('skill1').addEventListener('click', () => activateSkill(0));
  document.getElementById('skill2').addEventListener('click', () => activateSkill(1));
  document.getElementById('skill3').addEventListener('click', () => activateSkill(2));

  function activateSkill(skillIndex) {
    if (selectedChar) {
      const skill = selectedChar.skills[skillIndex];
      selectedChar.activeSkill = { ...skill, turnsLeft: skill.turns };
      battleLog.innerHTML += `<p>${selectedChar.name} 使用了技能：${skill.name}，效果：${skill.effect}攻击力/防御力 ${skill.value}，持续回合数：${skill.turnsLeft}</p>`;
    }
  }

  // 选择角色
  document.getElementById('chooseChar1').addEventListener('click', () => {
    if (battleChars.length > 0) {
      selectedChar = battleChars[0];
      battleLog.innerHTML += `<p>已选择角色 ${selectedChar.name}</p>`;
    }
  });

  document.getElementById('chooseChar2').addEventListener('click', () => {
    if (battleChars.length > 1) {
      selectedChar = battleChars[1];
      battleLog.innerHTML += `<p>已选择角色 ${selectedChar.name}</p>`;
    }
  });

  // 攻击并执行技能
  document.getElementById('attack').addEventListener('click', () => {
    if (!selectedChar || battleEnemies.length === 0) {
      battleLog.innerHTML += "<p>请先选择角色并确保有敌人在场！</p>";
      return;
    }

    // 选择一个敌人
    const enemyIdx = Math.floor(Math.random() * battleEnemies.length);
    const enemy = battleEnemies[enemyIdx];

    // 计算伤害（如果技能启用，增强攻击）
    let damage = selectedChar.物理伤害;
    if (selectedChar.activeSkill) {
      if (selectedChar.activeSkill.name === "提升攻击力") {
        damage += selectedChar.activeSkill.value;
      }
      selectedChar.activeSkill.turnsLeft--;
      if (selectedChar.activeSkill.turnsLeft <= 0) {
        selectedChar.activeSkill = null;
      }
    }

    enemy.currentHp -= damage;
    battleLog.innerHTML += `<p>${selectedChar.name} 对敌人造成了 ${damage} 点伤害！</p>`;

    if (enemy.currentHp <= 0) {
      battleEnemies.splice(enemyIdx, 1);
      battleLog.innerHTML += "<p>敌人被击败！</p>";
    }

    renderBattleEnemies();
    renderBattleChars();
  });

  // ====== 初始化 ======
  renderBattleChars();
  renderBattleEnemies();
});
