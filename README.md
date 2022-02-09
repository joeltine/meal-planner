# meal-planner

## Development

To run the app locally:

```
export SPRING_DATASOURCE_PASSWORD=MYSQL_PW
export ZESTFUL_API_KEY=KEY
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
