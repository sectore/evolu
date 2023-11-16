import { EvoluCommonLive } from "@evolu/common";
import { Layer } from "effect";
import { DbWorkerLive } from "./DbWorkerLive.js";
import { Bip39Live, FlushSyncLive, PlatformNameLive } from "./PlatformLive.js";

export const EvoluCommonWebLive = EvoluCommonLive.pipe(
  Layer.use(Layer.mergeAll(Bip39Live, DbWorkerLive, FlushSyncLive)),
  Layer.use(PlatformNameLive),
);
