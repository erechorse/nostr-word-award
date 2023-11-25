import { eventKind, NostrFetcher } from "npm:nostr-fetch";
import { writeCSV } from "https://deno.land/x/csv@v0.9.2/mod.ts";
import { parseArgs } from "https://deno.land/std@0.208.0/cli/mod.ts";

const args = parseArgs(Deno.args);
const time = Number(args.since);
const relay = String(args.relay);
const fetcher = NostrFetcher.init();

// get all events
const allPosts = await fetcher.fetchAllEvents(
    [relay],
    { kinds: [ eventKind.text ] },
    { since: time},
    { skipVerification: true, sort: true }
)

// pick up only necessary data
const data = allPosts.map(post => [
    post.pubkey,
    String(post.created_at),
    post.content
]);

// save data
const f = await Deno.open("../resource/data.csv", {
    write: true,
    create: true,
    truncate: true
});
await writeCSV(f, data);

Deno.exit(0);
