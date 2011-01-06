CORPUSNAME="icepahc"
VERSION="0.3"
DIRNAME=$CORPUSNAME"-v"$VERSION"/"
TEMPFILE="temp.psd"
rm -rf $DIRNAME
mkdir $DIRNAME
cp lgpl.txt $DIRNAME"lgpl.txt"
cp gpl.txt $DIRNAME"gpl.txt"
cp README $DIRNAME"README"

mkdir $DIRNAME"psd"
mkdir $DIRNAME"info"

cp finished/*.psd $DIRNAME"psd"
cp info/*.info $DIRNAME"info"

for i in $(ls icepahc-v0.3/psd/*.psd);
do
echo "/*" >> $TEMPFILE
cat README >> $TEMPFILE
echo "*/" >> $TEMPFILE
cat $i >> $TEMPFILE
mv $TEMPFILE $i
done
exit
