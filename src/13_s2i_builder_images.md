# Openshift Workshop: S2I builder images

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Redhat provided builder images

https://access.redhat.com/containers/?count=10#/category/Builder%20Image

---

## JBoss EAP S2I

https://access.redhat.com/containers/?tab=overview#/registry.access.redhat.com/jboss-eap-7/eap71-openshift

---

## Java S2I

https://access.redhat.com/containers/?tab=overview#/registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift

----

* Builds a maven project
* Runs a single (fat-)jar from /target directory
* `java -jar myjar.jar`

Use cases:

* Spring Boot Microservices

---

## NodeJS 8 S2I

https://access.redhat.com/containers/?tab=overview#/registry.access.redhat.com/rhoar-nodejs/nodejs-8

----

* Runs `npm install`
* `npm start`

* Leverages *nodeshift* npm package

https://github.com/nodeshift/nodeshift

---

## Ruby S2I

https://access.redhat.com/containers/?tab=overview#/registry.access.redhat.com/rhscl/ruby-24-rhel7

---

## Discussion

Questions?

Would you use S2I builds?
