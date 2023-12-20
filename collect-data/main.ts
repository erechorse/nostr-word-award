import { eventKind, NostrFetcher } from "npm:nostr-fetch";
import { writeCSV } from "https://deno.land/x/csv@v0.9.2/mod.ts";
import { parseArgs } from "https://deno.land/std@0.208.0/cli/mod.ts";

const args = parseArgs(Deno.args);
const year = Number(args.year);
const month = Number(args.month);
const relay = String(args.relay);
const fetcher = NostrFetcher.init();

const startDate = new Date(year, month - 1);
const endDate = new Date(year, month);

const since = startDate.getTime() / 1000;
const until = endDate.getTime() / 1000 - 1;

// get all events
const allPosts = await fetcher.fetchAllEvents(
    [relay],
    { kinds: [ eventKind.text ] },
    { since: since, until: until },
    { skipVerification: true, sort: true }
)

// pick up only necessary data
const data = allPosts.map(post => [
    post.pubkey,
    String(post.created_at),
    post.content
]);

const pad = String(month).padStart(2, "0");

// save data
const f = await Deno.open(`../resource/${String(year)}.${pad}.csv`, {
    write: true,
    create: true,
    truncate: true
});
await writeCSV(f, data);

Deno.exit(0);
