<div class="row">
  <div class="col-xs-12">
    <div class="panel panel-default">
      <div class="panel-heading">Anon settings and data</div>
      <div class="panel-body">
        <form role="form" class="anon-settings">
          <div class="form-group">
            <label for="uid">Bot ID</label>
            <input type="text" id="uid" name="uid" title="User ID" class="form-control" placeholder="User ID"><br />
          </div>
          <div class="form-group">
            <label for="appSecret">App salt</label>
            <input type="text" id="appSecret" name="appSecret" title="App Secret" class="form-control" placeholder="App Secret"><br />
          </div>
          <div class="form-group">
            <label for="accessCategory">Access category ID's</label>
            <input type="text" id="accessCategory" name="accessCategory" title="Access categories" class="form-control" placeholder="1, 2, 3, 4, 5"><br />
          </div>
          <div class="form-group">
            <label for="timeToClearPublishedList">Time, when to can again make posts</label>
            <input type="text" id="timeToClearPublishedList" name="timeToClearPublishedList" title="Hours" class="form-control" placeholder="Hours"><br />
          </div>
        </form>
        <form role="form" class="anon-addBanList">
          <div class="form-group">
            <label for="banSignField">Add sign to ban list</label>
            <input type="text" id="banSignField" name="banSignField" title="Sign" class="form-control" placeholder="abcdef123456789qwerty"><br />
          </div>
        </form>
          <button id="addBanList" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Add</button>
      </div>
    </div>
  </div>
</div>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
  <i class="material-icons">save</i>
</button>