# Unit Tests

This directory contains unit tests for the e-library application using Bun's built-in test runner.

## Structure

```
tests/
├── repositories/       # Repository layer tests
│   ├── UserRepository.test.ts
│   ├── BookRepository.test.ts
│   └── LibraryRepository.test.ts
├── services/          # Service layer tests
│   ├── UserService.test.ts
│   ├── BookService.test.ts
│   └── LibraryService.test.ts
└── README.md
```

## Running Tests

### Run all tests

```bash
bun test
```

### Watch mode (re-run on file changes)

```bash
bun test:watch
```

### Run specific test file

```bash
bun test tests/services/UserService.test.ts
```

### Run tests matching a pattern

```bash
bun test -t "create"
```

### Generate coverage report

```bash
bun test:coverage
```
