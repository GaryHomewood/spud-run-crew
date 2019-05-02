import { AttendanceGraph } from './attendanceGraph';
import { RankingGraph } from './rankingGraph';

class Dashboard {
  init() {
    Tabletop.init({
      key: '1MD4emE3qmFyUSM5cFHu8ZqfEaykRIl_ntogntnPfGfs',
      callback: this.drawGraphs,
      simpleSheet: true
    });
  }

  drawGraphs(data) {
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const w = 400 - margin.left - margin.right;
    const h = 200 - margin.top - margin.bottom;

    const attendanceGraph = new AttendanceGraph(w, h, margin, data);
    attendanceGraph.draw();

    const rankingGraph = new RankingGraph(w, h, margin, data)
    rankingGraph.draw();

    document.getElementById('loading').classList.add('hidden')
    document.getElementById('main').classList.remove('hidden')
  }
}

export { Dashboard };
