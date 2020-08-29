var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : null;
var tn = (o, s) => o ? o.getElementsByTagName(s) : null;
var gi = (o, s) => o ? o.getElementById(s) : null;
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));


function convert2TsvAndDownload(records, named_file){
  var fileArray = records;
  var tsvReady = (s) => s ? s.replace(/\t|\u0009/g, ' ').replace(/\r|\n/g, '↵').replace(/"/g, "'") : s;
  var unqHsh = (a, o) => a.filter(i => o.hasOwnProperty(i) ? false : (o[i] = true));
  var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
  var str = (o) => typeof o == 'object' ? tsvReady(JSON.stringify(o).replace(/\n|\r/g, ' ')) : o;
  var firstLevel = fileArray.map(el => Object.entries(el));
  var header = unqHsh(firstLevel.map(el => el.map(itm => itm[0])).flat(),{});
  var table = [header];
  for (var i = 0; i < firstLevel.length; i++) {
    var arr = [];
    var row = [];
    var record = firstLevel[i];
    for (var s = 0; s < record.length; s++) {
      var record_kv = record[s];
      var col_key = record_kv[0];      
      var place = header.indexOf(col_key);
      arr[place] = record_kv[1];
    }
    for (var a = 0; a < arr.length; a++) {
      if (arr[a]) {
        row.push(arr[a]);
      } else {
        row.push('');
      }
    }
    table.push(row);
  }
  function downloadr(arr2D, filename) {
    var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el => el.reduce((a, b) => a + '\t' + b)).reduce((a, b) => a + '\r' + b);
    var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
    var file = new Blob([data], {
      type: type
    });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
      var a = document.createElement('a'),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 10);
    }
  }
  var output_ = table.map(el => el.map(itm => str(itm)));
  downloadr(output_, named_file);
}

function downloadr2(arr2D, filename) {
  var data = /.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el=> el.reduce((a,b) => a+'	'+b )).reduce((a,b) => a+''+b);
  var type = /.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
  var file = new Blob([data], {    type: type  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    var a = document.createElement('a'),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 10);
  }
}

function parseURIasJSON(url,obj) {
  if(url.match(/(?<=\?|\&)\S+?(?=\&|$)/g)) url.match(/(?<=\?|\&)\S+?(?=\&|$)/g).map(r=> r ? r.split(/\=/) : [[]]).forEach(r=> obj[r[0]] = r[1])
  return obj;
}

var ul_card_class = 'bc-list bc-list-nostyle';
var title_class = 'bc-size-headline3';
var narrator_class = 'narratorLabel';
var author_class = 'authorLabel';
var series_class = 'seriesLabel';

var categories_class = 'bc-breadcrumb';
var runtime_class = 'runtimeLabel';
var	release_date_class = 'releaseDateLabel';
var publisher_class = 'publisherLabel';

function lengthOfBookInMinutes(s){
  var mins = reg(/\d+(?=\smin)/.exec(s),0) ? parseInt(reg(/\d+(?=\smin)/.exec(s),0)) : 0;
  var hours =  reg(/\d+(?=\shrs)/.exec(s),0) ? (parseInt(reg(/\d+(?=\shrs)/.exec(s),0)) * 60) : 0;
  return hours + mins;
}

function dateString(d){
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var date = new Date(d);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function getBookDetails(url){
  if(url){
    try{
      const res = await fetch(url);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text,'text/html');
      return parseBookDetails(doc);
    }
    catch(err){
      console.log(err);
      return {};
    }
  }else{return {};}
}

function parseBookDetails(doc){
  var categories = cn(doc,categories_class)[0] && Array.from(tn(cn(doc,categories_class)[0],'a')).length ? Array.from(tn(cn(doc,categories_class)[0],'a')).map(a=> a.innerText.trim()) : [];
  return {
    main_category: categories[0],
    sub_category: categories[categories.length-1],
    categories: categories,
    runtime: cn(doc,runtime_class)[0] ? lengthOfBookInMinutes(cn(doc,runtime_class)[0].innerText.replace(/length:/i,'').trim()) : '',
    release_date: cn(doc,release_date_class)[0] ? dateString(cn(doc,release_date_class)[0].innerText.replace(/.+date:/i,'').trim()) : '',
    publisher: cn(doc,publisher_class)[0] ? cn(doc,publisher_class)[0].innerText.replace(/Publisher:/i,'').trim() : '', 
  }
}

async function getAudibleLibraryPage(page){
  const res = await fetch(`https://www.audible.com/library/titles?ref=a_library_t_c6_pageNum_${page}&pageSize=50&page=${page+1}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text,'text/html');
  return parseLibraryPage(doc);
}

function parseLibraryPage(doc){
  return cn(doc,'adbl-library-content-row').length ? Array.from(cn(doc,'adbl-library-content-row')).map(card=> {
    let ul = cn(card,ul_card_class)[0];
    let author = cn(ul,author_class)[0];
    let narrator = cn(ul,narrator_class)[0];
    let series = cn(ul, series_class)[0];
    return {
      url: cn(ul,title_class)[0] && cn(ul,title_class)[0].parentElement ? cn(ul,title_class)[0].parentElement.href?.replace(/\?.+/,'') : '',
      title: cn(ul,title_class)[0] ? cn(ul,title_class)[0].innerText.trim() : '',
      author: author && cn(author,'bc-size-callout')[0] ? cn(author,'bc-size-callout')[0].innerText.trim() : '',
      narrator: narrator && cn(narrator,'bc-size-callout')[0] ? cn(narrator,'bc-size-callout')[0].innerText.trim() : '',
      series: series && tn(series,'a')[0] ? tn(series,'a')[0].innerText.trim() : '',
    }
  }) : [];
}


async function loopThroughtAudibleLibrary(){
  var contain_arr = [];
  for(let i=0; i<200; i++){
    const cards = await getAudibleLibraryPage(i);
    await delay(111);
    if(cards){
      cards.forEach(card=> {
        if( contain_arr.every(itm=> itm.url != card.url) ) contain_arr.push(card)
      });
      if(cards.some(card=> card.title == 'Your First Listen')) break;
    }
  }
  return contain_arr;
}

async function enrichLibraryInformation(){
  var library = await loopThroughtAudibleLibrary();
  console.log(library);
  var contain_arr = [];
  for(let i=0; i<library.length; i++){
    var details = await getBookDetails(library[i].url);
    var merge = {...library[i],...details};
    contain_arr.push(merge);
    if(i == 2) console.log(contain_arr);
    await delay(rando(1111)+1111);
  }
  console.log(contain_arr);
  convert2TsvAndDownload(contain_arr,'audible_export_' + new Date().getTime() + '.tsv');
  downloadr2(contain_arr,'audible_export_' + new Date().getTime() + '.json');
}


function createDownloadHTML() {
    if(gi(document,'downloading_notifier')) gi(document,'downloading_notifier').outerHTML = '';
      var cont = ele('div');
      a(cont, [['id', 'downloading_notifier'], ['style', `position: fixed; top: 100px; left: 40%; width: 430px; z-index: ${new Date().getTime()}; background: #121212; border: 1px solid #3de367; border-radius: 0.2em;`]]);
      document.body.appendChild(cont);
      var perc = ele('div');
      a(perc, [['id', 'downloading_percentage_bar'], ['style', `width: 0px; height: 50px; background: #3de367; border: 1px solid #3de367; border-bottom-right-radius: 0.2em; border-top-right-radius: 0.2em;`]]);
      cont.appendChild(perc);
      var txt = ele('div');
      a(txt, [['id', 'downloading_percentage_txt'], ['style', `float: left; padding: 14px; color: #fff; width: 430px;`]]);
      perc.appendChild(txt);
      txt.innerText = 'initiating download...';
}

enrichLibraryInformation()
