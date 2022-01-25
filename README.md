# meal-planner

## Development

To run the app locally:

```
mvn spring-boot:run
```

To build the project:

```
mvn compile
```

Running all tests:

```
mvn clean test
```

Run only python tests:

```
mvn exec:exec@python-test 
```

Run JS tests:

```
npm test
```

Configure git hooks:

```
git config core.hooksPath git-hooks/
```

Deploying from remote machine to Deus:

```
./deploy.sh
```
