import { AttendanceGraph } from './attendanceGraph';
import { RankingGraph } from './rankingGraph';
import { PaceGraph } from './paceGraph';
import Papa from 'papaparse'

class Dashboard {
  init() {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vQPdv3BxseDSRtsZ67azc0jrq649ixFLjhNSqj697Ga045ugmcRfZOoW-_Sw9qhyULx9j8DNrZUv_hl/pub?gid=0&single=true&output=csv', {
      download: true,
      header: true,
      complete: (results) => this.drawGraphs(results.data)
    })
  }

  drawGraphs(data) {
    document.getElementById('count').innerText = data.length;

    let dimens = { width: 300, height: 130, top: 30, right: 50, bottom: 40, left: 50 };

    const attendanceGraph = new AttendanceGraph(dimens, data);
    attendanceGraph.draw();

    const rankingGraph = new RankingGraph(dimens, data);
    rankingGraph.draw();

    const paceGraph = new PaceGraph(dimens, data);
    paceGraph.draw();

    document.getElementById('loading').classList.add('hidden')
    document.getElementById('main').classList.remove('hidden')
  }
}

export { Dashboard };
