export function setup(ctx) {
  const rscam = new Map();

  function rich(activity, based, f, act) {
    let m = new Map();
    for (let [kk, v] of activity.actions.registeredObjects) {
      let totalCost = 0;
      let level = v.level;
      for (const costItem of v.itemCosts) {
        totalCost += costItem.item.sellsFor * costItem.quantity;
      }
      let productSellsFor = v.product.sellsFor;
      let consdierablePrice = Math.floor(totalCost * (based + level / f));
      if (productSellsFor < consdierablePrice) {
        v.product.sellsFor = consdierablePrice;
      }
      m.set(
        kk,
        productSellsFor +
          "-->" +
          v.product.sellsFor +
          "=Math.floor(" +
          totalCost +
          "* (" +
          based +
          " + (" +
          level +
          " / " +
          f +
          ")))"
      );
    }
    rscam.set(act, m);
  }

  ctx.onModsLoaded((ctx) => {
    // Utilize other mod APIs at character select
    console.log("===> Rich Smith, Crafter And More");
    console.log(
      'Affected activity: ["crafting", "smithing", "fletching", "runecrafting"]'
    );
    console.log(
      "to check the modified price, please vist: game.__rscam.get('crafting') or others"
    );

    // make you rich to be a crafter
    rich(game.crafting, 1.001, 1000, "crafting");

    // make you rich to be a smith
    rich(game.smithing, 1.002, 1000, "smithing");

    // make you rich to be a hunter
    rich(game.fletching, 1.001, 1000, "fletching");

    // make you rich to be a witcher
    rich(game.runecrafting, 1.01, 1000, "runecrafting");

    // make you rich to be a herborist
    // rich(game.herblore, 1.008, 1000, "herblore");

    game.__rscam = rscam;

    let pathOfMelvorItems =
      game.items.weapons.namespaceMaps.get("pathOfMelvor");
    if (pathOfMelvorItems !== undefined) {
      // affects the pathOfMelvor weapons
      for (let [kk, vv] of pathOfMelvorItems) {
        if (vv.vanillaID !== undefined) {
          vv.sellsFor = game.items.getObjectByID(vv.vanillaID).sellsFor;
        }
      }
    }
  });

  ctx.onCharacterLoaded((ctx) => {
    // Modify or hook into game objects to influence offline calculations
  });

  ctx.onInterfaceReady((ctx) => {});
}
