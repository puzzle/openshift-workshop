# 12-factor apps

https://12factor.net/

----

1. Codebase: One codebase tracked in revision control, many deploys
2. *Dependencies*: Explicitly declare and isolate dependencies
3. *Config*: Store config in the environment
4. *Backing services*: Treat backing services as attached resources
5. *Build, release, run*: Strictly separate build and run stages
6. Processes: Execute the app as one or more stateless processes
7. *Port-Binding*: Export services via port binding
8. Concurrency: Scale out via the process model
9. Disposability: Maximize robustness with fast startup and graceful shutdown
10. Dev/prod parity: Keep development, staging, and production as similar as possible
11. *Logs*: Treat logs as event streams
12. Admin processes: Run admin/management tasks as one-off processes

----

## Dependencies

### Do

* Dependencies explicitely in codebase (pom.xml, gradle.build, package(-lock).json, Gemfile)

### Don'ts

* Dependency on system-wide packages for building (globally installed gulp, compass, etc.)
* Dependency on system tools for building (curl, wget, imagemagick)

----

## Config

### Do

* (Sensitive) configuration in environment variables

### Don'ts

* Configuration in files

----

## Backing Services

### Do

* DB URLs in configuration

### Don'ts

* DBs or other services in application container

----

## Build, release, run

### Do

* Strictly seperate build, release, run stages.
* Every build has an ID (build number, timestamp...)

### Don'ts

* Everything in one step

----

## Port-Binding

### Do

* Every service exposes one (or more) ports

### Don'ts

* Binding only localhost
* Binding specific IPs

----

## Logs

### Do

* Log to stdout

### Don'ts

* Log to files
