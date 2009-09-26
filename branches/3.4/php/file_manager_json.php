<?php

//根目录路径，可以指定绝对路径，比如 /var/www/attached/
$root_path = './../attached/';
//根目录URL，可以指定绝对路径，比如 http://www.yoursite.com/attached/
$root_url = '/ke34/attached/';
//图片扩展名
$ext_arr = array('gif', 'jpg', 'jpeg', 'png', 'bmp');

if (empty($_GET['path'])) {
    $current_path = realpath($root_path) . '/';
    $current_url = $root_url;
    $dir_path = '';
    $moveup_path = '';
} else {
    $current_path = realpath($root_path) . '/' . $_GET['path'];
    $current_url = $root_url . $_GET['path'];
    $dir_path = $_GET['path'];
    $moveup_path = preg_replace('/(.*?)[^\/]+\/$/', '$1', $dir_path);
}

//不允许使用..移动到上一级目录
if (preg_match('/\.\./', $current_path)) {
    echo 'Access is not allowed.';
    exit;
}
//最后一个字符不是/
if (!preg_match('/\/$/', $current_path)) {
    echo 'Parameter is not valid.';
    exit;
}
//目录不存在或不是目录
if (!file_exists($current_path) || !is_dir($current_path)) {
    echo 'Directory does not exist.';
    exit;
}

//遍历目录取得文件信息
$file_list = array();
if ($handle = opendir($current_path)) {
    $i = 0;
    while (false !== ($filename = readdir($handle))) {
        if ($filename{0} == '.') continue;
        $file = $current_path . $filename;
        if (is_dir($file)) {
            $file_list[$i]['is_dir'] = true;
            $file_list[$i]['has_file'] = (count(scandir($file)) > 2);
            $file_list[$i]['size'] = '-';
            $file_list[$i]['dir_path'] = urlencode($dir_path . $filename . '/');
        } else {
            $file_list[$i]['is_dir'] = false;
            $file_list[$i]['has_file'] = false;
            $file_list[$i]['size'] = ceil(filesize($file) / 1024) . 'KB';
            $file_list[$i]['dir_path'] = '';
        }
        $file_list[$i]['name'] = $filename;
        $file_list[$i]['url'] = $current_url . $filename;
        $file_list[$i]['datetime'] = date('Y-m-d H:i:s', filemtime($file));
        $file_ext = strtolower(array_pop(explode('.', trim($file))));
        $file_list[$i]['is_photo'] = in_array($file_ext, $ext_arr);
        $i++;
    }
    closedir($handle);
}

function cmp($a, $b) {
    if ($a['is_dir'] && !$b['is_dir']) {
        return -1;
    } else if (!$a['is_dir'] && $b['is_dir']) {
        return 1;
    } else {
        return strcmp($a['name'], $b['name']);
    }
}
usort($file_list, 'cmp');

$result = array();
$result['moveup_path'] = $moveup_path;
$result['current_path'] = $dir_path;
$result['total_count'] = count($file_list);
$result['file_list'] = $file_list;

header('Content-type: application/json; charset=UTF-8');
echo json_encode($result);
?>
