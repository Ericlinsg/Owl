// Espera o Owlbear Rodeo estar pronto
OBR.onReady(async () => {
  console.log("Combat Helper Toggle carregado!");

  // Cria item de menu de contexto único
  createToggleContextMenu();

  // Atualiza lista de tokens em combate no popover
  await refreshCombatList();
});

// =============================
// Cria menu de contexto único que adiciona ou remove
// =============================
function createToggleContextMenu() {
  OBR.contextMenu.createItem({
    id: "combat-helper/toggle-combat",
    label: "Add / Remove Combat",
    filter: {
      type: "token",
      layer: ["CHARACTER", "MOUNT"]
    },
    onClick: async (context) => {
      const tokenId = context.token.id;
      const token = await OBR.scene.getToken({ id: tokenId });

      // Se não estiver em combate → adiciona
      if (!token.metadata.combat || !token.metadata.combat.inCombat) {
        await addToCombat(tokenId);
      } else {
        // Se já estiver em combate → remove
        await removeFromCombat(tokenId);
      }

      // Atualiza a lista da UI
      await refreshCombatList();
    }
  });
}

// =============================
// Adiciona token ao combate
// =============================
async function addToCombat(tokenId) {
  const token = await OBR.scene.getToken({ id: tokenId });

  const combatData = {
    inCombat: true,
    hp: token.metadata.hp || 0,
    ac: token.metadata.ac || 10,
    initiative: token.metadata.initiative || 0
  };

  await OBR.scene.updateToken({
    id: tokenId,
    metadata: {
      ...token.metadata,
      combat: combatData
    }
  });

  OBR.notification.show(`Token "${token.name}" adicionado ao combate!`);
}

// =============================
// Remove token do combate
// =============================
async function removeFromCombat(tokenId) {
  const token = await OBR.scene.getToken({ id: tokenId });

  if (token.metadata.combat) {
    const newMetadata = { ...token.metadata };
    delete newMetadata.combat;

    await OBR.scene.updateToken({
      id: tokenId,
      metadata: newMetadata
    });

    OBR.notification.show(`Token "${token.name}" removido do combate!`);
  }
}

// =============================
// Atualiza lista de tokens em combate na UI
// =============================
async function refreshCombatList() {
  const listContainer = document.getElementById("combat-list");
  const sceneTokens = await OBR.scene.getTokens();
  const combatTokens = sceneTokens.filter(t => t.metadata.combat && t.metadata.combat.inCombat);

  if (combatTokens.length === 0) {
    listContainer.innerHTML = "<p>Nenhum token em combate.</p>";
    return;
  }

  listContainer.innerHTML = "";
  combatTokens.forEach(token => {
    const div = document.createElement("div");
    div.className = "combat-token";
    div.innerHTML = `
      <span>${token.name} (HP: ${token.metadata.combat.hp})</span>
      <span>
        <button onclick="attackToken('${token.id}')">Atacar</button>
        <button onclick="removeFromCombat('${token.id}'); refreshCombatList();">Remover</button>
      </span>
    `;
    listContainer.appendChild(div);
  });
}

// =============================
// Função de ataque simples
// =============================
async function attackToken(tokenId) {
  const token = await OBR.scene.getToken({ id: tokenId });
  const damage = Math.floor(Math.random() * 6) + 1; // 1d6
  const hp = (token.metadata.combat.hp || 0) - damage;

  await OBR.scene.updateToken({
    id: tokenId,
    metadata: {
      ...token.metadata,
      combat: { ...token.metadata.combat, hp }
    }
  });

  OBR.notification.show(`${token.name} sofreu ${damage} de dano! (HP: ${hp})`);
  await refreshCombatList();
}
