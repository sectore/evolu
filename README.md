# Evolu

The first complete and usable library for local-first software

It's so simple that everybody can understand how it works, and it's so powerful that you can start building apps on it right now.

Those are strong claims, so let me explain them, but first things first — what is local-first software, and why do we need it?

## Local-first software

The term local-first is probably best described in [this famous article](https://www.inkandswitch.com/local-first/).

TLDR; Local-first software allows users to own their data. It means data are stored in the user's device(s), so local-first software can work offline. How is it different from keeping files on disk? A very. Files are not the right abstraction for applications and are complicated or impossible to synchronize among devices. That's why client-server architecture rules the world. But as with everything, it has trade-offs.

### The trade-offs of the client-server architecture

Client-server architecture provides us with easy backup and synchronization, but all that fun depends on the ability of the server to fulfill its promises. Companies go bankrupt, users are banned, errors occur, all those things happen all the time, and then what? Right, that's why the world needs local-first software. But until now, writing local-first software has been challenging because of the lack of libraries and design patterns. I personally failed several times, and that's why I created Evolu.

## What Evolu is

_Evolu is React Hooks library for local-first software with end-to-end encrypted backup and sync using SQLite and CRDT._

It's even more, but this is the shortest claim I have been able to come up with. Evolu is my idea of how local-first software should be written.

- It must use an SQL database in the browser. No leaky abstractions.
- It has to have as minimal API as possible. No barriers.
- The source code must be as simple as possible. No Ph.D. complexity.
- It must use types as much as possible. Autocomplete FTW.
- All data must be end-to-end encrypted. No excuses.
- Developer experience is foremost. And always will be.

That's why I wasn't satisfied with prior work and had to create Evolu. But it does not mean I did not use any. On the contrary, I used many other people's work and ideas. First and foremost, the Evolu CRDT is almost a clone of James Long [CRDT for mortals](https://www.youtube.com/watch?v=DEcwa68f-jY).

## Getting Started

The complete Next.js example is [here](https://github.com/evoluhq/evolu/tree/main/apps/web).

### Create a table with columns

```ts
const { useQuery, useMutation } = createHooks({
  todo: {
    id: model.id<"todo">(),
    title: model.NonEmptyString1000,
    isCompleted: model.SqliteBoolean,
  },
});
```

### Query data

```ts
const { rows } = useQuery((db) =>
  db
    .selectFrom("todo")
    .select(["id", "title", "isCompleted", "updatedAt"])
    .orderBy("updatedAt")
);
```

### Mutate data

```ts
const handleAddTodoClick = () => {
  const title = model.NonEmptyString1000.safeParse(
    prompt("What needs to be done?")
  );
  if (!title.success) {
    alert(JSON.stringify(title.error, null, 2));
    return;
  }
  mutate("todo", { title: title.data });
};
```

### Show mnemonic (your safe autogenerated password)

```ts
const handleShowMnemonic = () => {
  getOwner().then((owner) => {
    // Mnemonic is your safe password for backup and sync.
    // It's safe because it's long and autogenerated.
    // Evolu is not only local but also private first software.
    // All your data are encrypted with OpenPGP, the same ProtonMail uses.
    alert(owner.mnemonic);
  });
};
```

### Delete all your local data

```ts
const handleResetOwner = () => {
  if (confirm("Are you sure? It will delete all your local data."))
    resetOwner();
};
```

### Restore your data elsewhere

```ts
const handleRestoreOwner = () => {
  const mnemonic = prompt("Your Mnemonic");
  if (mnemonic == null) return;
  const either = restoreOwner(mnemonic);
  if (either._tag === "Left") alert(JSON.stringify(either.left, null, 2));
};
```

### Handle errors

```ts
const evoluError = useSyncExternalStore(subscribeError, getError, constNull);

useEffect(() => {
  // eslint-disable-next-line no-console
  if (evoluError) console.log(evoluError);
}, [evoluError]);
```

And that's all. Minimal API is the key to a great developer experience.

## Privacy

Evolu uses end-to-end encryption and generates strong and safe passwords for you. Evolu sync and backup server see only timestamps. Nothing more. We plan to do at least two security audits.

## Trade-offs

> “There are no solutions. There are only trade-offs.” ― Thomas Sowell

Evolu is not pure P2P software. For syncing and backup, there needs to be a server. Evolu server is very minimal, and everyone can run their own. While it's theoretically possible to have pure P2P Evolu, I haven't seen a reliable solution yet. It's not only a technical problem; it's mainly an economic problem. Someone has to be paid to keep all your data safe. Evolu provides a free server (syncUrl in Evolu config) for testing. Soon we will provide our paid server for production usage.

All table columns except for ID are nullable by default. It's not a bug; it's a feature. Evolu data, like all local-first data, ale meant to last forever, but applications data schemas evolve. Local-first software can migrate data only locally. This design decision is inspired by GraphQL [nullability](https://graphql.org/learn/best-practices/#nullability) and [versionless](https://graphql.org/learn/best-practices/#versioning) schema.

Evolu CRDT has no support for transactions because CRDT transactions are still an unsolved issue. Instead of a half-baked solution, I made a design decision not to implement them. I have a few ideas but need a community to discuss them, and it's not a show-stopper.

## Community

Use Github discussions for now.

[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/evoluhq.svg?style=social&label=Follow%20%40evoluhq)](https://twitter.com/evoluhq)

## Contributing

Evolu monorepo uses [pnpm](https://pnpm.io/).

Install the dependencies with:

```
pnpm install
```

Build Evolu monorepo:

```
pnpm build
```

Start developing and watch for code changes:

```
pnpm dev
```

Describe changes for release log:

```
pnpm changeset
```
