<div class="modal" tabindex="-1" role="dialog" id="trackChartModal">
    <div class="modal-dialog modal-lg"role="document">
      <div class="modal-content">
        <div class="modal-header">
          
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="trackChartBody">
            <div>

                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active smat-rounded uaNav" id="retweetTab" data-toggle="pill"
                            href="#retweetTabContent" role="tab" aria-controls="retweetTabContent"
                            aria-selected="true">Retweet Frequency</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link smat-rounded  uaNav " id="quotedTab" data-toggle="pill"
                            href="#quotedTabContent" role="tab" aria-controls="pills-profile"
                            aria-selected="false">Quoted Frequency </a>
                    </li>




                    <li class="nav-item">
                        <a class="nav-link smat-rounded uaNav" id="replyTab" data-toggle="pill"
                            href="#replyTabContent" role="tab" aria-controls="pills-contact"
                            aria-selected="false">Reply Frequency</a>
                    </li>
                </ul>

            </div>
            <div class="tab-content" id="pills-tabContent">

                <div class="tab-pane fade show active  trackChartDiv" id="retweetTabContent" role="tabpanel"
                    aria-labelledby="retweetTabContent">
                </div>
                <div class="tab-pane fade  trackChartDiv  " id="quotedTabContent" role="tabpanel" aria-labelledby="quotedTabContent">
                </div>

                <div class="tab-pane fade  trackChartDiv " id="replyTabContent" role="tabpanel"
                    aria-labelledby="replyTabContent"> </div>

            </div>
 


        </div>
      </div>
    </div>
  </div>