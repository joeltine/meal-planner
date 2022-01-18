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

Running tests:

```
mvn clean test
```

Configure git hooks:

```
git config core.hooksPath git-hooks/
```

Deploying:

```
mvn package wagon:upload-single@upload-jar wagon:sshexec@upload-jar
```
