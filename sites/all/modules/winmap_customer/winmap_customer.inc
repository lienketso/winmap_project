<?php
function winmap_customer_page_callback() {
  return _winmap_render_theme("module","winmap_customer","templates/pages/customer_index_page.tpl.php");
}

function winmap_admin_customer_create_page() {
  return _winmap_render_theme("module","winmap_customer","templates/pages/customer_create_page.tpl.php");
}

function winmap_admin_customer_edit_page() {
  return _winmap_render_theme("module","winmap_customer","templates/pages/customer_edit_page.tpl.php");
}
