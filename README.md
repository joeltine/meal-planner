# Meal Planner Documentation

## Initial Setup

Required to be installed locally:

- Docker
- Java 11
- Maven
- node+npm
- MySQL

## Development

To run the app:

```
export SPRING_DATASOURCE_PASSWORD=MYSQL_PW
export ZESTFUL_API_KEY=KEY
mvn spring-boot:run
```

Start JS/CSS devserver with livereload:

```
npm run watch
```

To build everything (downloads all Maven and npm deps). Required to pick up HTML template and Java
changes:

```
mvn compile
```

Build only JS/CSS:

```
npm run build
```

Code style:

Style is handled using Google JS Style in Intellij. You can download the Intellij Google Style
configuration [here as an XML file](https://github.com/google/styleguide/blob/gh-pages/intellij-java-google-style.xml)
. All formatting is done using the "Reformat Code" functionality on save.

## Testing

Running all tests (Java/Python/JS):

```
mvn [clean] test
```

Run only python tests:

```
mvn exec:exec@python-test 
```

Run JS tests once:

```
npm test
```

"Live" JS testing (recompiles and reruns JS tests on each save):

```
npm run itest
```

Lint and auto-fixing:

```
npm run lint
npm run lint:fix
```

## Git

Configure git hooks:

```
git config core.hooksPath git-hooks/
```

## Deployment

Deploying from remote machine to Deus (will prompt for meal-planner Deus Linux user password):

```
./deploy.sh
```
