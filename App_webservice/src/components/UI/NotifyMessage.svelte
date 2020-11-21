<script>
  
</script>

<style>
  .alert.alert-info {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14),
      0 7px 10px -5px rgba(255, 255, 255, 0.4);
    background-color: white;
    color: #fff;
    border: 0;
    border-radius: 3px;
    position: relative;
    padding: 20px 15px;
    line-height: 20px;
    margin-top: 10px;
  }
  .alert.alert-with-icon i[data-notify="icon"] {
    font-size: 30px;
    display: block;
    left: 15px;
    position: absolute;
    top: 50%;
    margin-top: -15px;
    color: #a72abd;
  }
  .alert span {
    display: block;
    max-width: 89%;
    color: black;
    padding-left: 66px;
  }
</style>

<div class="container page">
  <div class="row">
    <div class="col s6 offset-m3">
      <div
        class="alert alert-info alert-with-icon center-align"
        data-notify="container">
        <i class="material-icons" data-notify="icon">info</i>
        <span data-notify="message" class="message">
          <slot></slot>
        </span>
      </div>
    </div>
  </div>
</div>
