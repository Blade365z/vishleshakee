<link href="public/css/app.css" rel="stylesheet">
<link href="public/font-awesome/css/all.css" rel="stylesheet">
<link href="public/tempCSS/story.css" rel="stylesheet" />

<script src="public/js/app.js"></script>
<style>
body {
    overflow-x: hidden;
    margin: 0 0 110px;
    font-family: Roboto;
    background-color: var(--color-bg) !important;
}
.story-container{
    padding:20px 10% 20px 10%;
}
</style>
<script>
    var projectID = @json($projectID ?? '');
    var storyID = @json($storyID ?? '');
</script>
    <div class="story-container">
        <div id="storyViewer">

        </div>
        
    </div>
<script type="module"  src="public/tempJS/project/storyViewer.js"></script>