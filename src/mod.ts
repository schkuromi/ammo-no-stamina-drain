import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { BaseClasses } from "@spt/models/enums/BaseClasses";

class Mod implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables: IDatabaseTables = databaseServer.getTables();

        // prepare item helper
        const itemHelper: ItemHelper = container.resolve<ItemHelper>("ItemHelper");
        const items = Object.values(tables.templates.items);

        // Set all ammo to have 0 stamina drain
        const ammoItems = items.filter(x =>itemHelper.isOfBaseclass(x._id, BaseClasses.AMMO));

        for (const ammo of ammoItems)
        {
            if (ammo._props.StaminaBurnPerDamage)
            {
                ammo._props.StaminaBurnPerDamage = 0;
            }
        }
    }
}

export const mod = new Mod();
