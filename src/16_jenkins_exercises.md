# Openshift Workshop: Jenkins CI/CD with Openshift Exercises

<small>tran@puzzle.ch</small>

<!-- .slide: class="master01" -->

---

## Exercise 1: Setup your Jenkins

`oc new-app jenkins-ephemeral`

This creates a Jenkins Server.

---

## Exercise 2: Freestyle project: Openshift Create

1. Login to your jenkins using your Openshift Credentials.
2. Create a freestyle project called *freestyle-create*
3. Add a build step *"Create OpenShift resource(s)"*

----

4. Insert into the *json/yaml field* the output of `oc new-app httpd -o yaml`
5. Build your *freestyle-create* project
6. Check the console output of your build

---

## Exercise 3: Freestyle project: Openshift Delete

1. Create a freestyle project called *freestyle-delete*
2. Create a build *"Delete Openshift resources by key"* step that deletes your `ImageStream` (*is/static-site*)
3. Create an additional build step *"Delete Openshift resources by label"* that deletes all objects with label app=static-site

----

4. Build your *freestyle-delete* project
5. Check the console output of your build
6. Check the web console if the resources have been deleted

---

## Exercise 4: Hello World pipeline project

1. Create a pipeline project called *pipeline-create*

----

2. Insert script below (click to copy):

```groovy
pipeline {
  agent {
    node {
      label 'maven' 
    }
  }
  options {
    timeout(time: 10, unit: 'MINUTES') 
  }
  stages {
    stage('hello') {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              echo "Hello from project: ${openshift.project()}"
            }
          }
        }
      }
    }
  }
}
```
---

## Exercise 5: Pipeline Create

In your previous pipeline script,
add a new stage *cleanup*:

```groovy
stage('cleanup') {
    steps {
        script {
            openshift.withCluster() {
                openshift.withProject() {
                    def httpdExample = openshift.selector("all", [ template : 'httpd-example' ])
                    if (httpdExample.exists()) {
                        httpdExample.delete()
                    }
                }
            }
        }
    }
}
```
----

Add a new stage *create*:

```groovy
stage('create') {
    steps {
        script {
            openshift.withCluster() {
                openshift.withProject() {
                    def models = openshift.process( "openshift//httpd-example")
                    openshift.create(models)
                }
            }
        }
    }
}
```

----

Run your pipeline and check if your deployment has been created successfully.

---

## Exercise 6: Wait for builds and deployments

Add a new stage:

```groovy
stage('waitForBuild') {
    steps {
        script {
            openshift.withCluster() {
                openshift.withProject() {
                    def builds = openshift.selector("bc", "httpd-example").related('builds')
                    builds.untilEach(1) {
                        return (it.object().status.phase == "Complete")
                    }
                }
            }
        }
    }
}
```

----

Add a new stage:

```groovy
stage('waitForDeployment') {
    steps {
        script {
            openshift.withCluster() {
                openshift.withProject() {
                    openshift.selector("dc", "httpd-example").related('pods').untilEach(1) {
                        return (it.object().status.phase == "Running")
                    }
                }
            }
        }
    }
}
stage('AfterDeployment') {
    steps {
        echo "Everything is ready! Maybe run some tests?"
    }
}
```

----

Run your pipeline. Does it work properly?

---

## Exercise 7: Leverage Openshift pipeline builds

Create a file called *`pipeline-in-openshift.yaml*:

```yaml
kind: "BuildConfig"
apiVersion: "v1"
metadata:
  name: "pipeline-in-openshift"
spec:
  strategy:
    jenkinsPipelineStrategy:
      jenkinsfile: |
        pipeline {
            agent {
                node {
                    label 'maven' 
                }
            }
            options {
                timeout(time: 10, unit: 'MINUTES') 
            }
            stages {
                stage('hello') {
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject() {
                                    echo "Hello from project: ${openshift.project()}"
                                }
                            }
                        }
                    }
                }
            }
        }
```

----

Import the build configuration in Openshift:

`oc create -f pipeline-in-openshift.yaml`

----

Check the build in the openshift web console:

Builds --> Pipeline

----

Start the build manually using the web console. Or using `oc`:

`oc start-build pipeline-in-openshift`

---

## Exercise 8: Create a pipeline build from GIT

Create a secret:

`oc create secret generic --type=kubernetes.io/basic-auth --from-literal=username=kaynewest --from-literal=password=00000000 bitbucket`

----

Annotate the secret:

`oc annotate secret bitbucket build.openshift.io/source-secret-match-uri-1=https://bitbucket.balgroupit.com/*`

----

`oc new-build https://bitbucket.balgroupit.com/scm/ows/pipeline-from-git.git --strategy=pipeline`

(Somehow *oc* client asks for password twice?)

----

Check your build in the web console