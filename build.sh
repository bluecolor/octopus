 #!/bin/bash

SOURCE_HOME=$(pwd)
DIST_DIR=$SOURCE_HOME/dist
TMP_DIR=$DIST_DIR/tmp
OCTOPUS_HOME=$TMP_DIR/octopus

major=''
minor=''
version_code=''

while read -r line; do
  IFS='=' read -a arr <<< "$line"
  case "${arr[0]}" in
    "MAJOR")
      major="${arr[1]}"
      ;;
    "MINOR")
      minor="${arr[1]}"
      ;;
    "VERSION_CODE")
      version_code="${arr[1]}"
      ;;
    *)
      ;;
  esac
done < $SOURCE_HOME/backend/version.properties

version=$major.$minor.$version_code

echo "Building for version" $version "..."

echo "Cleaning tmp directory"
rm -fr $TMP_DIR
mkdir $TMP_DIR

echo "Copying backend as octopus home"
cp -R backend $OCTOPUS_HOME

echo "Building frontend"
cd $SOURCE_HOME/frontend
npm run build

echo "Copying frontend files"
cd $SOURCE_HOME
rm -f $OCTOPUS_HOME/src/main/resources/static/index.html
cp -R $SOURCE_HOME/frontend/dist/*.* $OCTOPUS_HOME/src/main/resources/static

cd $OCTOPUS_HOME
rm -fr $OCTOPUS_HOME/build/libs/*.*
cp application.properties.template $OCTOPUS_HOME/build/libs/application.properties

echo "Building ..."
gradle build
rm -f $OCTOPUS_HOME/build/libs/*.original
cp $SOURCE_HOME/backend/version.properties $OCTOPUS_HOME/build/libs/version.properties

rm -fr $TMP_DIR