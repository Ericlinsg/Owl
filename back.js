OBR.onReady(() => {
  console.log("Combat Helper ready!");

  OBR.contextMenu.createItem({
    id: "combat-helper/toggle-combat",
    label: "Add / Remove Combat",
    filter: {
      type: "token",             // só tokens
      layer: ["CHARACTER", "MOUNT"]
    },
    onClick: async (context) => {
      const tokenId = context.token.id;
      const token = await OBR.scene.getToken({ id: tokenId });

      // Toggle combate
      if (!token.metadata.combat?.inCombat) {
        await OBR.scene.updateToken({
          id: tokenId,
          metadata: {
            ...token.metadata,
            combat: {
              inCombat: true,
              hp: token.metadata.hp || 0,
              ac: token.metadata.ac || 10
            }
          }
        });
        OBR.notification.show(`${token.name} adicionado ao combate!`);
      } else {
        const newMetadata = { ...token.metadata };
        delete newMetadata.combat;
        await OBR.scene.updateToken({ id: tokenId, metadata: newMetadata });
        OBR.notification.show(`${token.name} removido do combate!`);
      }
    }
  });
});
