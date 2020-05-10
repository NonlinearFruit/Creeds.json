<p align="center">
  <img src="./metadata/feature_graphic.png">
</p>

This is a collection of historic creeds of the Christian faith. This repo focuses on the Reformed church.

## Creeds Included
- [x] [Abstract of Principles (1858)](https://www.sbts.edu/about/abstract/)
- [x] [Apostles' Creed (710)](https://www.crcna.org/welcome/beliefs/creeds/apostles-creed)
- [x] [Athanasian Creed (800)](https://www.wikiwand.com/en/Athanasian_Creed)
- [x] [Belgic Confession (1561)](http://apostles-creed.org/wp-content/uploads/2014/07/belgic_confession.pdf)
- [x] [Canons of Dort (1619)](http://apostles-creed.org/wp-content/uploads/2014/07/canons-of-dort.pdf)
- [x] [Catechism For Young Children (1840)](https://static1.squarespace.com/static/590be125ff7c502a07752a5b/t/5a84cca971c10b7697dda564/1518652588323/Engles%2C+Joseph+Patterson%2C+Catechism+for+Young+Children.pdf)
- [x] [Chalcedonian Definition (451)](https://www.ccel.org/ccel/schaff/creeds2.iv.i.iii.html)
- [x] [Chicago Statement on Biblical Inerrancy (1978)](https://library.dts.edu/Pages/TL/Special/ICBI_1.pdf)
- [x] [Christ Hymn of Colossians (60)](https://esv.literalword.com/?q=colossians+1%3A15-19)
- [x] [Christ Hymn of Philippians (60)](https://esv.literalword.com/?q=Philippians+2%3A6-10)
- [x] [Confession of Peter (30)]()
- [x] [Council of Orange (529)](www.onthewing.org/user/Creed_Council%20of%20Orange%20-%20Pelagianism.pdf)
- [x] [First Catechism (1996)](https://opc.org/cce/FirstCatechism.html)
- [x] [First Confession of Basel (1534)](http://apostles-creed.org/wp-content/uploads/2014/09/The-First-Confession-of-Basel-1534.pdf)
- [x] [First Helvetic Confession (1536)](https://quod.lib.umich.edu/e/eebo/A13256.0001.001?rgn=main;view=fulltext)
- [x] [French Confession of Faith (1559)](https://www.ccel.org/ccel/schaff/creeds3.iv.vii.html)
- [x] [Heidelberg Catechism (1563)](http://apostles-creed.org/wp-content/uploads/2014/07/Heidelberg-Catechism-with-Intro.pdf)
- [x] [Irenaeus' Rule of Faith (180)]()
- [x] [Keach's Catechism (1693)](http://www.reformedreader.org/ccc/keachcat.htm)
- [x] [1689 London Baptist Confession (1677)](http://apostles-creed.org/wp-content/uploads/2014/07/London-Baptist-of-Faith-1689.pdf)
- [x] [Matthew Henry's Scripture Catechism (1703)](https://www.blueletterbible.org/study/ccc/mh_sc.cfm)
- [x] [Nicene Creed (381)](http://www.onthewing.org/user/Creed_Nicene.pdf)
- [x] [Puritan Catechism (1855)](https://www.blueletterbible.org/study/ccc/chs_puritancatechism.cfm)
- [x] [Scots Confession (1560)](http://apostles-creed.org/wp-content/uploads/2014/07/Scots_Confession_1560.pdf)
- [x] [Second Helvetic Confession (1562)](https://www.ccel.org/creeds/helvetic.htm)
- [x] [Shema Yisrael (-1500)](https://esv.literalword.com/?q=deut+6%3A4)
- [x] [Ten Theses of Berne (1528)](https://ccel.org/ccel/schaff/hcc8/hcc8.iv.iv.ii.html)
- [x] [Tetrapolitan Confession (1530)](http://apostles-creed.org/wp-content/uploads/2014/09/tetrapolatan-strasbourg-swabian-confession.pdf)
- [x] [Waldensian Confession (1120)](http://apostles-creed.org/wp-content/uploads/2014/07/waldensian_confession_1120.pdf)
- [x] [Westminster Confession of Faith (1646)](http://apostles-creed.org/wp-content/uploads/2014/07/the-westminster-confession-of-faith.pdf)
- [x] [Westminster Larger Catechism (1647)](http://apostles-creed.org/wp-content/uploads/2014/07/the-westminster-larger-catechism.pdf)
- [x] [Westminster Shorter Catechism (1647)](https://www.apuritansmind.com/westminster-standards/shorter-catechism/)
- [x] [Zwingli's 67 Articles (1523)](https://christianhistoryinstitute.org/study/module/zwinglis-sixty-seven-articles/)
## Json Structure

Every json file includes a `Metadata` and `Data` attribute on the root object. The metadata structure is identical across every file. The data varies depending on the `CreedFormat` but there are some conventions.

### Json Conventions

- The bulk text of a creed should be in `Content` attributes

### Metadata Structure

```
{
  "Metadata": {
    "Title": "",
    "AlternativeTitles": [""],
    "Year": "",
    "Authors": [""],
    "Location": "",
    "OriginalLanguage": "",
    "OriginStory": "",
    "SourceUrl": "",
    "SourceAttribution": "",
    "CreedFormat": ""
  }
}
```

### Creed Formats

There are several 'formats' to these creeds. Here are the big 4 and what they are called.

#### Creed

This format is named such due to most of the earliest creeds falling into this category.

```
{
  "Data": {
    "Content": "..."
  }
}
```

#### Canon

This format needed a name and so it has one. Though maybe 'Consensus' would be more fitting.

```
{
  "Data": [
    {
      "Article": "",
      "Title": "",
      "Content": "..."
    }
  ]
}
```

#### Confession

This format is named after the Westminster Confession, which has chapters with sections.

```
{
  "Data": [
    {
      "Chapter": "",
      "Title": "",
      "Sections": [
        {
          "Section": "",
          "Content": "..."
        }
      ]
    }
  ]
}
```

#### Catechism

The only format with an intuitive name.

```
{
  "Data": [
    {
      "Number": "",
      "Question": "...",
      "Answer": "..."
    }
  ]
}
```

### Proof Texts

Any object with a `Content` attribute could optionally have proof texts for that content.

```
{
  "Content": "...",
  "ContentWithProofs": "...",
  "Proofs": [
    {
      "Id": "",
      "References": ""
    }
  ],
  "ProofsWithScripture`": [
    {
      "Id": "",
      "References": ""
    }
  ]
}
```

## Handy Dandy Scripts

Add metadata to existing json:

```
jq '{ "Metadata": { "Title": "", "AlternativeTitles": [""], "Year": "", "Authors": [""], "Location": "", "OriginalLanguage": "", "OriginStory": "", "SourceUrl": "", "SourceAttribution": "", "CreedFormat": "" }, "Data": . }' ten_theses_of_berne.json
```
