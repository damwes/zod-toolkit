<img width="160" height="160" alt="image" src=".github/assets/zod-toolkit.png" />

# Zod Toolkit

Stop rewriting validators. Ship production-ready schemas with Zod Toolkit. 🚀

## Features

- Validation integrated with Zod v4
- +10 schema common ready-to-use validations
- Ready for Node.js, React, Next.js, NestJS, etc.
- Easy to import and use directly with Zod schemas

Built to enhance [Zod](https://zod.dev/) standard validations, `zod-toolkit` integrates seamlessly into your projects the same way you’d use Zod.

## Installation

```bash
npm install zod-toolkit
```

```bash
yarn add zod-toolkit
```

```bash
pnpm add zod-toolkit
```

## Available schemas

### Global

| Schema     | Usage            | Description                                                                    |
| ---------- | ---------------- | ------------------------------------------------------------------------------ |
| `fullname` | `z.fullname()`   | Validates full names (first and last name required, no numbers)                |
| `username` | `z.username()`   | Validates usernames (3–20 chars, alphanumeric with `.` and `_`)                |
| `otp`      | `z.otp(length?)` | Validates one-time passwords with a given digit length (default: 6)            |
| `nodeEnv`  | `z.nodeEnv()`    | Validates Node.js environment (`production`, `development`, `test`, `staging`) |
| `port`     | `z.port()`       | Validates port numbers as string (0–65535)                                     |

### Coerce

| Schema | Usage             | Description                                            |
| ------ | ----------------- | ------------------------------------------------------ |
| `port` | `z.coerce.port()` | Validates and coerces port numbers as number (0–65535) |

### Brazil (`z.br`)

| Schema | Usage         | Description                                                                                    |
| ------ | ------------- | ---------------------------------------------------------------------------------------------- |
| `cpf`  | `z.br.cpf()`  | Validates CPF numbers (`000.000.000-00` or `00000000000`)                                      |
| `cnpj` | `z.br.cnpj()` | Validates numeric and alphanumeric CNPJs (`AA.AAA.AAA/AAAA-00` or `AAAAAAAAAAAA00`, uppercase) |
| `cep`  | `z.br.cep()`  | Validates CEP postal codes (`00000-000` or `00000000`)                                         |

## Basic usage

You just need to define a schema and use custom validations. For the purposes of this guide, we'll use a simple object schema:

```ts
import { z } from "zod-toolkit";

const Customer = z.object({
  username: z.username(),
  oneTimePassword: z.otp(6),
  cpf: z.br.cpf(),
  cnpj: z.br.cnpj(),
});

type CustomerSchema = z.infer<typeof Customer>;
```

## Locale

Zod Toolkit has built-in locale support. All custom schemas return localized error messages that switch dynamically at parse time — no need to recreate your schemas after changing the locale.

### Setting the locale

```ts
import { z } from "zod-toolkit";

// Default locale is "en"
z.locale.set("pt");
```

When you call `z.locale.set()`, it also configures Zod's built-in error messages (via `z.config()`), so both Zod Toolkit schemas and native Zod schemas use the same language.

### Checking the current locale

```ts
z.locale.current; // "pt"
```

### Locale-aware error messages

Error messages are resolved at **parse time**, so you can change the locale at any point and all schemas will reflect the new language:

```ts
import { z } from "zod-toolkit";

const schema = z.br.cpf();

// Default (English)
z.treeifyError(schema.safeParse("invalid").error).errors;
// ["Invalid CPF: must be 11 digits in the format 000.000.000-00 or 00000000000."]

// Switch to Portuguese
z.locale.set("pt");
z.treeifyError(schema.safeParse("invalid").error).errors;
// ["CPF inválido: deve conter 11 dígitos no formato 000.000.000-00 ou 00000000000."]
```

### Custom error messages

You can always override the default message by passing a custom `error` parameter. This takes priority over the locale:

```ts
z.br.cpf({ error: "Please enter a valid CPF" });
z.otp(6, { error: "Invalid code" });
z.username({ error: "Choose a valid username" });
```

### Per-step error messages

Composite validators run as an ordered, fail-fast sequence of named steps, each with its own localized message:

| Validator             | Steps (in order)                     |
| --------------------- | ------------------------------------ |
| `br.cnpj`, `br.cpf`   | `format` → `repeated` → `checkDigit` |
| `br.cep`              | `format` → `repeated` → `range`      |
| `username`            | `length` → `charset`                 |
| `port`, `coerce.port` | `format` → `range`                   |

Override individual steps with `errors`. Precedence: `errors[step]` > `error` > localized default.

```ts
z.br.cnpj({ errors: { checkDigit: "Check the last two digits" } });
z.br.cpf({ error: (issue) => `Failed at: ${issue.params?.step}` });
```

Unknown step names are a compile-time error.

### Supported locales

Zod Toolkit locale support is powered by Zod v4's locale system. The following locales are available:

| Code   | Language        | Code | Language   | Code   | Language              |
| ------ | --------------- | ---- | ---------- | ------ | --------------------- |
| `ar`   | Arabic          | `he` | Hebrew     | `no`   | Norwegian             |
| `az`   | Azerbaijani     | `hu` | Hungarian  | `ota`  | Ottoman Turkish       |
| `be`   | Belarusian      | `id` | Indonesian | `pl`   | Polish                |
| `bg`   | Bulgarian       | `is` | Icelandic  | `ps`   | Pashto                |
| `ca`   | Catalan         | `it` | Italian    | `pt`   | Portuguese            |
| `cs`   | Czech           | `ja` | Japanese   | `ru`   | Russian               |
| `da`   | Danish          | `ka` | Georgian   | `sl`   | Slovenian             |
| `de`   | German          | `kh` | Khmer      | `sv`   | Swedish               |
| `en`   | English         | `km` | Khmer      | `ta`   | Tamil                 |
| `eo`   | Esperanto       | `ko` | Korean     | `th`   | Thai                  |
| `es`   | Spanish         | `lt` | Lithuanian | `tr`   | Turkish               |
| `fa`   | Persian         | `mk` | Macedonian | `ua`   | Ukrainian             |
| `fi`   | Finnish         | `ms` | Malay      | `uk`   | Ukrainian             |
| `fr`   | French          | `nl` | Dutch      | `ur`   | Urdu                  |
| `frCA` | French (Canada) |      |            | `vi`   | Vietnamese            |
|        |                 |      |            | `yo`   | Yoruba                |
|        |                 |      |            | `zhCN` | Chinese (Simplified)  |
|        |                 |      |            | `zhTW` | Chinese (Traditional) |

> [!NOTE]
> Zod Toolkit currently ships custom error messages in `en` and `pt`. For other locales, Zod's built-in messages will be localized, but Zod Toolkit's custom schema messages will fall back to English. Contributions for additional translations are welcome!
