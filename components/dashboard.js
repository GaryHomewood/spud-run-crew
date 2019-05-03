import { AttendanceGraph } from './attendanceGraph';
import { RankingGraph } from './rankingGraph';
import { PaceGraph } from './paceGraph';

class Dashboard {
  init() {
    Tabletop.init({
      key: '1MD4emE3qmFyUSM5cFHu8ZqfEaykRIl_ntogntnPfGfs',
      callback: this.drawGraphs,
      simpleSheet: true
    });
  }

  drawGraphs(data) {
    const dimens = { width: 320, height: 130, top: 30, right: 30, bottom: 40, left: 50 };

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
