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
    (new AttendanceGraph(data)).draw();
    (new RankingGraph(data)).draw();
    document.getElementById('loading').classList.add('hidden')
    document.getElementById('main').classList.remove('hidden')
  }
}

export { Dashboard };
