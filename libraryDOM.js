var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : null;
var tn = (o, s) => o ? o.getElementsByTagName(s) : null;
var gi = (o, s) => o ? o.getElementById(s) : null;
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

function parseURIasJSON(url,obj) {
  if(url.match(/(?<=\?|\&)\S+?(?=\&|$)/g)) url.match(/(?<=\?|\&)\S+?(?=\&|$)/g).map(r=> r ? r.split(/\=/) : [[]]).forEach(r=> obj[r[0]] = r[1])
  return obj;
}

async function getAudibleLibraryPage(url){
  const { ref, pf_rd_p, pf_rd_r, sortBy, pageSize } = url;
  const res = await fetch(`https://www.audible.com/library/titles?ref=${ref}&pf_rd_p=${pf_rd_p}&pf_rd_r=${pf_rd_r}&sortBy=${sortBy}&pageSize=${pageSize}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text,'text/html');
  let cards = parseLibraryPage(doc);
  let next_url = cn(doc,'nextButton')[0] && tn(cn(doc,'nextButton')[0],'a')[0] ? tn(cn(doc,'nextButton')[0],'a')[0].href : null;
  let output = {next_url: next_url, cards: cards,}
  return output;
}


var ul_card_class = 'bc-list bc-list-nostyle';
var title_class = 'bc-size-headline3';
var narrator_class = 'narratorLabel';
var author_class = 'authorLabel';
var series_class = 'seriesLabel';
var next_class = 'nextButton';

function parseLibraryPage(doc){
  return Array.from(cn(doc,'adbl-library-content-row')).map(card=> {
    let ul = cn(card,ul_card_class)[0];
    let author = cn(ul,author_class)[0];
    let narrator = cn(ul,narrator_class)[0];
    let series = cn(ul, series_class)[0];
    return {
      title: cn(ul,title_class)[0] ? cn(ul,title_class)[0].innerText.trim() : '',
      url: cn(ul,title_class)[0] && cn(ul,title_class)[0].parentElement ? cn(ul,title_class)[0].parentElement.href : '',
      author: author && cn(author,'bc-size-callout')[0] ? cn(author,'bc-size-callout')[0].innerText.trim() : '',
      narrator: narrator && cn(narrator,'bc-size-callout')[0] ? cn(narrator,'bc-size-callout')[0].innerText.trim() : '',
      series: series && tn(series,'a')[0] ? tn(series,'a')[0].innerText.trim() : '',
    }
  });
}

var contain_arr = [];
async function loopThroughtAudibleLibrary(){
  var next_url = parseURIasJSON(window.location.href,{});
  
  for(let i=0; i<4; i++){
      console.log(next_url)
    const res = await getAudibleLibraryPage(next_url);
    if(res){
      next_url = parseURIasJSON(res.next_url,{});
// .replace(/page=\d+/, 'page='+(i+1)).replace(/pageNum_\d+/, 'pageNum_'+i);

      res.cards.forEach(card=> {
        if( contain_arr.every(itm=> itm.title != card.title) ) contain_arr.push(card)
      });
    }
  }
  console.log(contain_arr);
}
loopThroughtAudibleLibrary()
