<?
$db = new SQLite3("../sql/sqlite3.db");
function prune($obj) {
  $ret = $obj->fetchArray();
  if($ret) {
    foreach(array_keys($ret) as $key) {
      if(strval(intval($key)) == $key) {
        unset($ret[$key]);
      } else {
        $ret[$key] = htmlentities($ret[$key]);
        $ret[$key] = '<p>' . preg_replace('/\n/', '</p><p>', $ret[$key]) . '</p>';
      }
    }
  } 
  return $ret;
}

$res = Array();
$id = intval($_GET['id']);
$qres = $db->query("select quote from quotes where id=$id");
while(($res[] = prune($qres)) != null);
echo json_encode($res[0]);
