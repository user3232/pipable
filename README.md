# @user3232/pipable

Automates working mapping objects with `Object.entries`/`Object.fromEntries`.
Monadic like api.

## Usage

Install:

```sh
npm i user3232/pipable
```

Use: 

```ts

import { pipableObjectFrom } from '@user3232/pipable'

const mapped = pipableObjectFrom({
    a: 1,
    b: 2,
})
.mapKeyValue(
    (key, _) => key..toUpperCase(),
    (_, value) => value + 10,
)
.value

console.log(mapped)
// {A: 11, B: 12}
```

