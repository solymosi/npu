Neptun PowerUp!
===============

Ez a **Neptun PowerUp!** hivatalos oldala.

A program **felturbózza a Neptun-odat**: gyorsabb tárgy- és vizsgafelvétel, kidobás elleni védelem, automatikus belépés, könnyebben kezelhető felület, tárolható belépési adatok, és még sok más. 25 egyetem és főiskola **több mint 15 ezer** diákjának életét könnyíti meg már 2011 óta.

> [!CAUTION]
> **A Neptun PowerUp! a jelen formájában nem fog tovább működni 😢**
>
> A Neptun nemrég bevezetett egy **új felhasználói felületet**, amely teljesen máshogy működik, mint a régi. Néhány egyetem már most bevezette az új felületet, és arra lehet számítani, hogy záros határidőn belül mindenhol csak az új felület lesz elérhető.
>
> A Neptun PowerUp! **a régi felületre lett fejlesztve, így csak azzal kompatibilis**. Ahhoz, hogy az új felületen is működjön, szinte az összes modult a újra kellene írni. Ez sajnos jóval több időt és erőforrást igényelne tőlem, mint amennyit a projektre jelenleg rá tudok szánni 😕.
>
> A Neptun PowerUp! legelső verzióját 2011-ben tettem közzé, nem sokkal azután, hogy felvettek a Corvinus-ra. Három évvel később, 2014-ben lediplomáztam és kiköltöztem külföldre, így az elmúlt 10 évben nem volt aktív jogviszonyom magyar egyetemen. Ennek ellenére továbbra is rendszeresen időt szántam arra, hogy még ha a Neptun PowerUp! nem is kap új funkciókat, de legalább a meglévők működőképesek és hibamentesek maradjanak. Ehhez többen is jelentősen hozzájárultak pull request-ekkel és community support-tal, akiknek ezúton is köszönöm a segítségét.
>
> A jelenlegi helyzetben viszont a projekt fennmaradását csak abban az esetben látom lehetségesnek, ha valaki átveszi tőlem a fejlesztést, és újraírja a szkriptet, hogy az új Neptun felületen is működjön. Ennek hiányában **a projekt 2024 végén archiválásra fog kerülni**.

## Legújabb verzió

* Legfrissebb verzió: **2.4.0**
* Kiadás dátuma: **2022. december 9.**

Ha tudod, mit csinálsz, [kattints ide a telepítéshez](https://github.com/solymosi/npu/releases/latest/download/npu.user.js).<br>
Egyébként olvasd el lent a telepítési útmutatót.

## Telepítés

A szkript a legtöbb modern böngészőre telepíthető.<br>
A telepítéssel elfogadod a [használat feltételeit](#licensz) és az [adatvédelmi nyilatkozatot](#adatvédelmi-nyilatkozat).

1. Telepítsd a **TamperMonkey** kiegészítőt az alábbi oldalak egyikéről:
    * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey)
    * [Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    * [Microsoft Edge](https://microsoftedge.microsoft.com/insider-addons/detail/iikmkjmpaadaobahmlepeloendndfphd)
    * [Opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta)
    * [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)
1. Most már telepítheted a Neptun PowerUp! szkriptet. Ehhez [kattints ide](https://github.com/solymosi/npu/releases/latest/download/npu.user.js).
1. A megjelenő oldalon kattints az **Install** gombra.
1. Lépj be a Neptun-ra, és használd egészséggel.

## Mit tud?

Az alábbi funkciókkal rendelkezik a program:

#### Tárgy felvétele 1 kattintással

A felvenni kívánt kurzusokat már a jelentkezési időszak kezdete előtt bejelölheted. A Neptun PowerUp! eltárolja a választásodat a gépeden, hogy a jelentkezés pillanatában a tárgyaidat másodpercek alatt felvehesd. Nincs több órarend-nézegetés, ideges keresgélés és kurzus-jelölgetés a kritikus pillanatokban: csupán egy kattintás tárgyanként. Na jó, kettő, ha mindent beleszámolunk.

#### Kidobás elleni védelem

A szkript megakadályozza, hogy a Neptun kidobjon néhány percenként, megállítja a visszaszámlálót a jobb felső sarokban, és eltünteti a lejáró munkamenetre figyelmeztető ablakot is, hogy erre soha többet ne kelljen figyelned.

**Figyelem!** Mivel a szkript a böngészőben fut, bizonyos típusú kidobásokat nem tud megakadályozni (pl. erős túlterheltség, IP cím változás vagy a szerver újraindítása esetén). Ezzel kapcsolatban nem kérek hibajelentéseket.

#### Bejelentkezési adatok tárolása

A szkript tetszőleges számú felhasználónév/jelszó páros tárolására képes, hogy a belépés csak egy kattintás legyen. A telepítés után lépj be a Neptun-ra. A szkript meg fogja kérdezni, hogy mentse-e a belépési adataidat.

**Figyelem!** Az adatokat a program a helyi gépen, titkosítás nélkül tárolja, ezért – bár a jelszó kiolvasása némi hozzáértést igényel – csak olyan gépen használd ezt a funkciót, amelyhez más nem férhet hozzá.

#### Automatikus bejelentkezés

Ha van legalább egy eltárolt felhasználónév/jelszó páros, a szkript a bejelentkezési oldalon néhány másodperc várakozás után automatikusan beléptet.

#### Felturbózott szabad helyre várakozás

Telt ház esetén a szkript kétszer olyan gyakran próbálkozik a belépéssel, mint a Neptun, így pontosan kétszer olyan nagy esélyed van elhalászni egy éppen felszabaduló helyet. A próbálkozások maximális száma (30) is törlésre kerül, így a végtelenségig próbálkozhatsz a belépéssel.

#### Egyszerűbb félévválasztás

Eleged van abból, hogy minden egyes alkalommal ki kell választanod az aktuális félévet a félévválasztó menüből, mert a Neptun alapértelmezésben a rossz félévet hozza be? A Neptun PowerUp! véget vet ennek, ugyanis megjegyzi, hogy melyik félév volt utoljára kijelölve, és automatikusan visszavált rá, ha a Neptun elállítja. Ezen kívül a félévek közötti váltás is egyetlen kattintásra rövidül, valamint a program még a Listázás gombot is megnyomja helyetted.

#### Könnyebben használható menü

Meg szeretnéd nyitni új lapon az órarendedet, mikor épp felveszed a tárgyakat? Sok sikert hozzá az eredeti felületen. A Neptun PowerUp! viszont módosítja a menüt, hogy a linkeket szükség esetén új lapon is megnyithasd.

Ezen kívül a leggyakrabban használt oldalakat (órarend, leckekönyv, tárgyjelentkezés, vizsgajelentkezés) ezután egyetlen kattintással, közvetlenül a menüsorról is elérheted. Ehhez használd a színes menüelemeket.

#### Felturbózott tárgyfelvétel oldal

Az alábbi kis változtatások értékes másodperceket spórolhatnak neked a Neptun megnyitásakor, a tárgyak minél gyorsabb felvétele érdekében:

* A tárgyak automatikusan listázódnak, így nem kell minden alkalommal a “Tárgyak listázása” gombra kattintanod.
* A szkript módosít néhány színt a tárgyfelvétel oldalon, hogy jobban lásd a felvett tárgyaid állapotát. A felvett, de (még) nem teljesített tárgyak sárga hátteret, a sikeresen teljesített tárgyak pedig zöld hátteret kapnak.
* Az egyes kurzusok bejelöléséhez elég a kurzus sorára kattintani, és nem kell precízen becélozni a pipálós dobozt a sor végén. Ez jelentős segítség.

#### Felturbózott vizsgajelentkezés oldal

Az alábbi változtatások a vizsgajelentkezést hivatottak könnyíteni:

* A vizsgák automatikusan listázódnak, miután kiválasztottad a megfelelő félévet. A tárgyak listájában ráadásul csak azok a tárgyak jelennek meg, melyekhez tartozik legalább egy vizsga.
* A szkript módosít néhány színt az oldalon, hogy jobban lásd az egyes vizsgák állapotát. A vizsgaeredménnyel még nem rendelkező tárgyak felvett vizsgái sárga hátteret, a sikeresen teljesített tárgyak vizsgái zöld hátteret, a kizárólag sikertelen vizsgákkal rendelkező tárgyak vizsgái pedig piros hátteret kapnak.
* A vizsgajelentkezés oldalon lehetőség van elrejteni a már teljesített tárgyakhoz tartozó vizsgákat.

#### Könnyebben használható órarend, leckekönyv és előrehaladás oldalak

Az órarend megnyitáskor automatikusan a mai napra ugrik, ha esetleg nem lenne ott, ezzel javítva a Neptun egyik legidegesítőbb hibáját. A szkript ezen kívül módosít néhány színt a leckekönyv és az előrehaladás oldalon, hogy könnyebben nyomon követhesd a teljesített és a még teljesítendő tárgyakat.

#### Bezárható “új hivatalos üzenet” értesítés

Ha van olvasatlan hivatalos üzeneted, akkor a Neptun addig nem enged továbblépni, amíg el nem olvastad azt. A Neptun PowerUp! lehetőséget ad a továbblépésre akkor is, ha épp nincs időd vagy kedved elolvasni az üzenetet.

#### Fejléc eltüntetése

A Neptun fejléce alapesetben a képernyő harmadát elfoglalja, ami kis képernyő esetén elég idegesítő. Mivel a vigyorgó pofákon és a Neptun Meet Street gombon kívül semmi érdekes nincs rajta, a szkript eltünteti neked.

#### Automatikus oldalméret-beállítás

Eleged van abból, hogy minden egyes alkalommal be kell állítanod, hogy 500 elemet akarsz látni egy oldalon a 20 helyett? A Neptun PowerUp! automatikusan 500 elemet jelenít meg minden listában, és eltünteti az oldalméret-választó menüt.

## Újdonságok

#### 2022. december 9.

* **Újdonság:** A belépéskor mostantól lehetőség van bekapcsolni az automatikus átirányítást a legutóbb megtekintett Neptun oldalra. – _FeaXR_
* **Fejlődés:** A fejléc eltüntetéséhez a szkript mostantól a Neptun beépített funkcióját használja, így az szükség esetén ismét megjeleníthető. – _FeaXR_

#### 2021. december 21.

* **Újdonság:** A vizsgajelentkezés oldalon mostantól lehetőség van a nem jelentkezett vizsgák elrejtésére. – _FeaXR_
* **Újdonság:** A Neptun PowerUp! verziója most már a Neptun bejelentkezési oldalán is megjelenik.
* **Javítva:** Egy Neptun-frissítés elrontotta a felvett vizsgák oldalon a teljesített vizsgák hátterének színezését.

#### 2021. december 3.

* **Javítva:** Az ELTE Neptun legutóbbi frissítése megakadályozta a szkript helyes működését. A probléma javításra került. – _MSZGs_

#### 2021. január 30.

* **Fejlődés:** A szkript használata most már valamivel nehezebben észlelhető az üzemeltetők által.

#### 2021. január 26.

* **Újdonság:** Az "önnek kitöltendő kérdőíve van" felugró ablak mostantól automatikusan elrejtésre kerül. – _nyuszika7h_
* **Fejlődés:** A szkript forráskódja teljesen át lett szervezve, ezzel megkönnyítve a jövőbeni módosításokat.

#### 2020. szeptember 1.

* **Javítva:** A Corvinus Neptun-jának címe megváltozott, emiatt a szkript egyes böngészőkben nem működött. Ez a frissítés javítja a problémát.

#### 2020. április 23.

* **Újdonság:** A szkript most már a legtöbb egyetem oktatói Neptun felületén is működik.

#### 2018. december 19.

* **Javítva:** A legutóbbi Neptun frissítés (ismét) megakadályozta a szkript megfelelő működését a “felvett vizsgák” oldalon. – _Whisperity_

#### 2018. május 29.

* **Javítva:** A legutóbbi Neptun frissítés megakadályozta a szkript megfelelő működését a “felvett vizsgák” oldalon. – _Whisperity_

#### 2018. január 7.

* **Fejlődés:** Ez a frissítés javítja a vizsgaeredmények sikeres és sikertelen kategóriákba való besorolását, hogy a vizsgák színezése lehetőség szerint minden egyetemen jól működjön.
* **Javítva:** A vizsgajelentkezés oldalon a “teljesített tárgyak vizsgáinak elrejtése” funkció tévesen elrejtette a már sikeresen teljesített tárgyak felvett, de még eredménnyel nem rendelkező javítóvizsgáit.
* **Javítva:** A felvett vizsgák oldalon bizonyos vizsgák mellett a szkript hibás működése miatt nem jelent meg a “részletek” menü ikonja.

#### 2017. december 8.

* **Javítva:** A vizsgajelentkezés oldal bizonyos esetekben teljesítettnek tekintett “nem vizsgázott” státuszú vizsgákat. Ez a frissítés javítja a problémát, és megakadályozza a jövőben a nem teljesített vizsgák téves elrejtését.
* **Javítva:** A szkript hibásan színezte a tárgyválasztó menü elemeit a vizsgajelentkezés oldalon.

#### 2017. november 27.

* **Javítva:** A Firefox 57-es frissítése és a GreaseMonkey új 4-es verziója elrontott pár dolgot a szkript működésében. Ez a frissítés javítja a problémát.

#### 2017. szeptember 11.

* **Újdonság:** A szkript hozzáad egy “most nem érdekel” gombot az “új hivatalos üzenet” értesítés ablakához, amelyet megnyomva az értesítés eltüntethető az üzenet megtekintése nélkül is.
* **Javítva:** Egyes esetekben a tárgyjelentkezés oldalon lévő táblázat fejlécében nem jelent meg a szűrés jelölőnégyzet és a törlés link.

#### 2017. január 16.

* **Javítva:** Bizonyos esetekben az átsorolási kérelem Neptun-oldal nem működött megfelelően. Ez a frissítés javítja a hibát.

#### 2017. január 15.

* **Újdonság:** A vizsgajelentkezés oldalon található tárgylistában mostantól nem jelennek meg azok a tárgyak, melyekhez nem tartozik vizsga. – _Whisperity_
* **Javítva:** A legutóbbi Neptun-frissítés elrontotta a félévválasztó menü szűrését. Ez a frissítés javítja a hibát. – _Whisperity_

#### 2016. augusztus 17.

* **Újdonság:** A félévválasztó menüben csak a képzés felvétele utáni félévek jelennek meg. – _Whisperity_

#### 2016. július 24.

* **Javítva:** A tárolt kurzusok bizonyos esetekben nem töltődtek vissza megfelelően. Ez a frissítés javítja a problémát.

#### 2016. június 15.

* **Javítva:** A felvett de még nem teljesített vizsgák most már helyesen színeződnek. – _Whisperity_

#### 2016. június 13.

* **Újdonság:** Mostantól lehetőség van elrejteni a sikeresen teljesített tárgyak vizsgáit a vizsgajelentkezés oldalon. – _Whisperity_
* **Újdonság:** A vizsgajelentkezés oldalon a szkript zöldre színezi a már sikeresen teljesített tárgyakat és pirosra a csak sikertelen vizsgákkal rendelkezőket. Az először felvett vizsgák továbbra is sárga színnel jelennek meg. – _Whisperity_
* **Újdonság:** A felvett vizsgák oldal is színesebb lett, a vizsgajelentkezés oldalhoz hasonló színezési szabályokkal. – _Whisperity_

#### 2016. május 23.

* **Javítva:** Chrome alatt a szkript most már nem dobál figyelmeztetéseket minden oldalbetöltés után.

#### 2015. szeptember 3.

* **Javítva:** Telt ház esetén az automatikus újrapróbálkozás egy hiba miatt bizonyos esetekben egyáltalán nem működött Firefox alatt. Ez a frissítés várhatóan javítja a problémát.
* **Javítva:** A Neptun Meet Street menüelem nem működött Firefox alatt.

#### 2015. augusztus 28.

* **Javítva:** A szkript bizonyos esetekben egyáltalán nem volt hajlandó futni. Ez a frissítés remélhetőleg javítja a problémát.

#### 2015. január 27.

* **Javítva:** A tárgyak tárolása nem működött megfelelően, ha a tárgyfelvétel oldalon a _minden további intézményi tárgy_ lehetőség volt kiválasztva.
* **Javítva:** A szkript problémába ütközött a tárolandó tárgy kódjának megállapításakor, ha a tárgykódban több zárójel is szerepelt. Mivel ez már legalább a harmadik ilyen jellegű probléma, a tárgykódot megállapító algoritmust teljesen újraírtam.

#### 2015. január 14.

* **Fejlődés:** A szkript mostantól csak akkor lép működésbe, ha meggyőződött arról, hogy egy Neptun oldalon fut éppen. Erre azért van szükség, mert egyes felhasználók kézzel átállították a szkript beállításait, hogy az ne csak a Neptun-os oldalakon fusson, amelynek hatására a felhasználói statisztika tele lett szemetelve oda nem illő weboldalak címeivel.

#### 2014. december 20.

* **Javítva:** A szkript hibásan tárolta a tárgyakat, ha a tárgynévben zárójelek is szerepeltek. Az új verzió javítja ezt a problémát. A frissítés után a hibásan tárolt tárgyaknál törölni kell a tárolt kurzusokat, majd ismét tárolni kell őket ahhoz, hogy immár helyesen kerüljenek mentésre.

#### 2014. november 30.

* **Javítva:** A Neptun legutóbbi frissítése olyan módosításokat tartalmazott, melyek miatt nem lehetett többé tárgyakat tárolni a tárgyfelvétel oldalon. Ez a frissítés javítja a problémát.
* **Újdonság:** Mivel van pár egyetem, ahol használják a Neptun Meet Street-et, a menüsor végére felkerült egy Meet Street link, amellyel át lehet váltani rá, ha már a szkript eltünteti a fejlécet. A Meet Street felületén szintén ugyanitt található egy másik link a tanulmányi rendszerre való visszaváltáshoz.

#### 2014. szeptember 6.

* **Javítva:** A Firefox 30-as frissítése jelentősen megváltoztatott bizonyos dolgokat a motorháztető alatt, melyek teljesen elrontották a szkript működését. Ez a frissítés remélhetőleg javítja a problémát, és ismét működőképessé teszi a programot a Firefox újabb verziói alatt.
* **Fejlődés:** A tárgyfelvétel oldalon a “csak a meghirdetett tárgyak” jelelőnégyzet működése megváltozott. Az automatikus tárgylistázás most már a négyzet ki- és bepipálásakor is megtörténik.
* **Eltávolítva:** A képzésválasztó menü megjelenítését kijavították a Neptun fejlesztői, így már nincs szükség beavatkozásra ahhoz, hogy az oldal újratöltése nélkül jelenjen meg.

#### 2014. február 6.

* **Javítva:** A szkript hibásan tárolta a tárgyakat, ha a tárgykódban zárójelek is szerepeltek. Az új verzió javítja ezt a problémát. A frissítés után a hibásan tárolt tárgyaknál törölni kell a tárolt kurzusokat, majd ismét tárolni kell őket ahhoz, hogy immár helyesen kerüljenek mentésre.

#### 2014. január 30.

* **Újdonság:** A szkript mostantól minden oldalon megjegyzi, hogy utoljára melyik félév volt kiválasztva, és automatikusan visszavált rá, ha a Neptun okosabbnak hiszi magát, és elállítja.
* **Újdonság:** A képzésválasztó menü az oldal újratöltése nélkül jelenik meg.
* **Újdonság:** A program lecseréli a Neptun teljes képernyős betöltés-jelzőjét egy “Kis türelmet” feliratra, amely kevésbé zavaró.
* **Fejlődés:** A félévválasztó menüben való kattintáskor a kijelölés azonnal átáll az új félévre, ezzel kellemesebb felhasználói élményt biztosítva.

#### 2013. december 24.

* **Újdonság:** Az órarend megnyitáskor automatikusan a mai napra ugrik, ha esetleg nem lenne ott, javítva ezzel a Neptun idegesítő hibáját.
* **Újdonság:** A szkript módosít néhány színt a leckekönyv oldalon, hogy jobban látszódjon, melyik tárgy lett már teljesítve: ezek zölddel jelennek meg.

#### 2013. december 14.

* **Újdonság:** A szkript módosít néhány színt az előrehaladás oldalon (amely a tanulmányok menüben található), hogy jobban látszódjon, melyik tárgy lett már felvéve (sárga) és teljesítve (zöld).

#### 2013. december 7.

* **Újdonság:** A tárgyak listája fölött megjelenik egy jelölőnégyzet, mellyel beállítható, hogy csak a tárolt kurzussal rendelkező tárgyak jelenjenek meg a listában. Ezt bepipálva még gyorsabbá válik a tárgyfelvétel.

#### 2013. december 6.

* **Fejlődés:** A mentett bejelentkezési adatokat a program egyetemenként külön-külön tárolja, így a bejelentkezésnél most már csak az adott egyetemen használt felhasználónevek jelennek meg.
* **Fejlődés:** A tárolt kurzusokat a program mostantól csak azon a képzésen jelzi, amelyen el lettek tárolva, a párhuzamos szakokkal rendelkezők nagy örömére. Az új verzió telepítése előtt eltárolt kurzusok továbbra is megjelennek az összes szaknál, amíg nem törlöd őket.

#### 2013. augusztus 20.

* **Fejlődés:** A tárgyfelvételnél a program pótolja a kurzusok jelölőnégyzeteit, ha azok esetleg nem jelennének meg. Így a tárgyak tárolása és az 1 kattintásos tárgyfelvétel most már elvileg az összes egyetemen működik.

#### 2013. július 19.

* **Javítva:** A legutóbbi Neptun verziófrissítés működésképtelenné tette a szkript néhány funkcióját. Ez a frissítés javítja a problémát.
* **Javítva:** A tárgyfelvétel oldalon a szkript bizonyos (meglehetősen ritka) esetekben hibásan módosította a színeket.

#### 2013. január 31.

* **Fejlődés:** A tárgyak listája fölött megjelenik egy link, amellyel a tárgyak sikeres felvétele után az összes tárolt kurzus egyszerűen törölhető.
* **Fejlődés:** Apróbb változások a tárolt tárgyak funkció működésében.

#### 2013. január 30.

* **Fejlődés:** A tárgyfelvételnél a program engedélyezi a letiltott kurzusok jelölőnégyzeteit, hogy azokat is el lehessen tárolni 1 kattintásos tárgyfelvétel céljából, ezzel lehetővé téve a funkció használatát egyes egyetemeken.

#### 2013. január 28.

* **Újdonság:** A tárgyfelvételnél a bejelölt kurzusok listája tárolható a helyi gépen, a tárolt kiválasztás pedig egy kattintással visszaállítható a tárgyak ablakában. Ezzel a tárgyak felvétele két kattintásra rövidül.

#### 2013. január 26.

* **Javítva:** A szabad helyre várakozásnál eddig előfordulhatott, hogy a szkript meghülyül, és egyre gyorsuló ütemben néhány perc alatt több ezer kísérletet tesz a belépésre. Az új verzió remélhetőleg javítja a problémát.

#### 2013. január 25.

* **Fejlődés:** A kidobás elleni védelem sokkal intelligensebb lett, ugyanis most már figyelembe veszi azt is, hogy az adott egyetemen pontosan hány perc inaktivitás van engedélyezve.
* **Fejlődés:** A program belső struktúrája jelentős változtatásokon esett át, így a forráskód most már sokkal könnyebben olvasható. Emiatt a későbbi fejlesztések remélhetőleg gyorsabbak és egyszerűbbek lesznek.

#### 2013. január 14.

* **Fejlődés:** Új, különálló menüelemek helyett a program mostantól a menüsor meglévő elemeit alakítja át gyorslinkekké. A _Tanulmányok_ szövegre kattintva a _Leckekönyv_ oldal, a _Tárgyak_ szövegre kattintva a _Tárgyjelentkezés_ oldal, míg a _Vizsgák_ szövegre kattintva a _Vizsgajelentkezés_ oldal jelenik meg. Egyedül az _Órarend_ menüelem maradt meg különállóként.

#### 2012. december 1.

* **Javítva:** Az automatikus bejelentkezés nem működött az ELTE szerverén.

#### 2012. november 16.

* **Javítva:** A legutóbbi Neptun verziófrissítés működésképtelenné tette a szkript néhány funkcióját. Ez a frissítés javítja a problémát.

#### 2012. szeptember 7.

* **Újdonság:** A tárgyfelvétel oldalon a felvett tárgyak sárga háttérrel, míg a teljesített tárgyak zöld háttérrel jelennek meg; így egyszerűbb különbséget tenni közöttük.
* **Fejlődés:** Az egységesség kedvéért a felvett vizsgák zöld helyett sárga háttérrel jelennek meg a vizsgajelentkezés oldalon. Sajnos arra nincs mód, hogy a program más színnel jelölje a sikeres vizsgákat.

#### 2012. augusztus 26.

* **Újdonság:** Tetszőleges számú automatikus próbálkozás a szabad helyre várakozásnál, az eredeti 30 helyett, valamint próbálkozás 5 másodpercenként, az eredeti 10 helyett.
* **Újdonság:** Az oldalméret minden egyes listánál automatikusan 500-ra áll be, és a program elrejti az oldalméret-választó mezőt.

#### 2012. augusztus 25.

* **Javítva:** A szakirányjelentkezés oldalon nem működött az új félévválasztó.
* **Javítva:** Az új félévválasztó egyes oldalakon felesleges lekéréseket küldött a Neptun szerverének. Ez a frissítés javítja a problémát.
* **Fejlődés:** Az új félévválasztó gombjai az új verzióban sokkal jobban néznek ki.
* **Fejlődés:** A tárgyfelvétel oldal kurzusválasztó ablakában a kurzusok színezését végző kód egyszerűbb és gyorsabb lett.

#### 2012. augusztus 21.

* **Javítva:** Egy Neptun frissítés néhány hibát okozott az automatikus bejelentkezés működésében. Az új verzió már megfelelően működik.
* **Újdonság:** A program az összes oldalon lecseréli a félévválasztó menüt egy könnyebben használható listára, ezzel megspórolva néhány kattintást a félévváltáskor. Keresd a kék félév-gombsort.

#### 2011. december 21.

* **Javítva:** A tárgyfelvétel oldal kiegészítései egyes egyetemek Neptun-jain nem működtek, mert ott más beállításai voltak a rendszernek.
* **Újdonság:** A menüben a hülye javascript-es linkeket a szkript lecseréli hagyományos linkekre, melyek megnyithatók új lapon a jobb gombos menüből, vagy a középső gombra kattintva. Ezen kívül a lap címe tartalmazza az aktuálisan megnyitott Neptun oldal címét.

#### 2011. december 13.

* **Javítva:** Az automatikus bejelentkezésnél bizonyos esetekben a program feleslegesen kérdezett rá a jelszó módosítására.

#### 2011. szeptember 14.

* **Javítva:** Az előző verzió bizonyos esetekben felesleges lekéréseket küldött a Neptun szerverének. Ez a frissítés javítja a problémát.

## Közreműködők

Köszönet az alábbi fejlesztőknek a Neptun PowerUp! jobbá tételében vállalt szerepükért:

* Whisperity

## Licensz

A programra az **[MIT License](http://opensource.org/licenses/MIT)** feltételei vonatkoznak, vagyis lényegében azt csinálsz vele, amit akarsz: szabadon használhatod, továbbadhatod, módosíthatod, és így tovább, viszont mindezt a **saját felelősségedre** teszed.

## Adatvédelmi nyilatkozat

A szkript **nem továbbít személyes adatokat külső szerverre**, bárminemű személyesadat-feldolgozás kizárólag a böngésződben, a saját gépeden történik.
