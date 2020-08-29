const reg = (o, n) => o ? o[n] : '';
const cn = (o, s) => o ? o.getElementsByClassName(s) : null;
const tn = (o, s) => o ? o.getElementsByTagName(s) : null;
const gi = (o, s) => o ? o.getElementById(s) : null;
const rando = (n) => Math.round(Math.random() * n);
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const ele = (t) => document.createElement(t);
const attr = (o, k, v) => o.setAttribute(k, v);
const a = (l, r) => r.forEach(a => attr(l, a[0], a[1]));

function convert2TsvAndDownload(records, named_file){
  const fileArray = records;
  const tsvReady = (s) => s ? s.replace(/\t|\u0009/g, ' ').replace(/\r|\n/g, '↵').replace(/"/g, "'") : s;
  const unqHsh = (a, o) => a.filter(i => o.hasOwnProperty(i) ? false : (o[i] = true));
  const unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
  const str = (o) => typeof o == 'object' ? tsvReady(JSON.stringify(o).replace(/\n|\r/g, ' ')) : o;
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
  gi(document, 'downloading_percentage_txt').innerText = 'Retrieving titles...';
  const page_size = parseInt(Array.from(document.getElementsByName('pageSize')[0].getElementsByTagName('option')).filter(r=> r && r.selected)[0].value);
  const num_pages = Math.max(...Array.from(document.getElementsByClassName('pageNumberElement')).map(p=> p.innerText.trim()).filter(r=> r && /^\d+$/.test(r)).map(n=> parseInt(n)));
  const num_titles = (page_size*num_pages);
  const total_results = Math.ceil(num_titles/50);
  const contain_arr = [];
  for(let i=0; i<total_results; i++){
    const cards = await getAudibleLibraryPage(i);
    await delay(111);
    if(cards){
      cards.forEach(card=> {
        if( contain_arr.every(itm=> itm.url != card.url) ) contain_arr.push(card)
      });
      if(cards.some(card=> card.title == 'Your First Listen')) break;
    }
    gi(document, 'downloading_percentage_bar').style.width = `${(430 * (i / total_results))}px`;
    gi(document, 'downloading_percentage_bar').style.background = i % 2 == 0 ? '#07ba5b' : '#3de367';
    gi(document, 'downloading_percentage_txt').innerText = `${Math.ceil((i / total_results) * 100)}% complete`;
  
  }
  return contain_arr;
}

async function enrichLibraryInformation(){
  createDownloadHTML();
  var library = await loopThroughtAudibleLibrary();
  console.log(library);
  var contain_arr = [];
  gi(document, 'downloading_percentage_txt').innerText = 'Retrieving addtional information on titles...';
  const total_results = library.length;
  for(let i=0; i<total_results; i++){
    var details = await getBookDetails(library[i].url);
    var merge = {...library[i],...details};
    contain_arr.push(merge);
    if(i == 2) console.log(contain_arr);
    await delay(rando(1111)+1111);
    gi(document, 'downloading_percentage_bar').style.width = `${(430 * (i / total_results))}px`;
    gi(document, 'downloading_percentage_bar').style.background = i % 2 == 0 ? '#07ba5b' : '#3de367';
    gi(document, 'downloading_percentage_txt').innerText = `${Math.ceil((i / total_results) * 100)}% complete -- approx ${Math.round(((((total_results-i)/100)*1.9)/60)*100)/100} minutes remaining`;
  
  }
  gi(document, 'downloading_percentage_bar').style.width = `430px`;
  gi(document, 'downloading_percentage_txt').innerText = `100% complete`
  console.log(contain_arr);
  convert2TsvAndDownload(contain_arr,'audible_export_' + new Date().getTime() + '.tsv');
  downloadr2(contain_arr,'audible_export_' + new Date().getTime() + '.json');
  if (gi(document, 'downloading_notifier')) gi(document, 'downloading_notifier').outerHTML = '';
}


function createDownloadHTML() {
  if(gi(document,'downloading_notifier')) gi(document,'downloading_notifier').outerHTML = '';
    let cont = ele('div');
    a(cont, [['id', 'downloading_notifier'], ['style', `position: fixed; top: 100px; left: 40%; width: 430px; z-index: ${new Date().getTime()}; background: #121212; border: 1px solid #3de367; border-radius: 0.2em;`]]);
    document.body.appendChild(cont);
    let perc = ele('div');
    a(perc, [['id', 'downloading_percentage_bar'], ['style', `width: 0px; height: 50px; background: #3de367; border: 1px solid #3de367; border-bottom-right-radius: 0.2em; border-top-right-radius: 0.2em; transition: all 1s;`]]);
    cont.appendChild(perc);
    let txt = ele('div');
    a(txt, [['id', 'downloading_percentage_txt'], ['style', `float: left; padding: 14px; color: #fff; width: 430px;`]]);
    perc.appendChild(txt);
    txt.innerText = 'initiating download...';
}

enrichLibraryInformation()
