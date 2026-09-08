import type { RbacDataset, Role, Permission } from './rbac';

// Source: authenticated CMS UI, 2026-09-07. Owner approved this source in the task.
// A transcription of 77 distinct observed List/Detail records, NOT synthetic fixtures.
// Username is the observed join key, NOT a fabricated backend user_id.
// No phone, IP, password, token, fabricated classification or system version is retained.
const departments = [
  'Phòng bảo hành',
  'Phòng quản lý kho',
  'Chưa có',
  'Phòng hành chính - nhân sự',
  'Phòng kỹ thuật',
  'Phòng kinh doanh',
];
const statuses = ['Đang hoạt động', 'Tạm ngưng', 'Đã khóa'];
const rows =
  `warranty-staff-03|Nhân viên bảo hành 03|warranty-staff-03@gmail.com|0|0|04-09-2026 15:39|WARRANTY_STAFF|Theo chức năng|
warranty-staff-02|Nhân viên bảo hành 02|warranty-staff-02@gmail.com|0|0|05-09-2026 15:26|WARRANTY_STAFF|Theo chức năng|
warehouse-staff-03|Nhân viên kho 03|warehouse-staff-03@gmail.com|1|0|04-09-2026 15:39|WAREHOUSE_STAFF|Theo chức năng|
warehouse-staff-02|Nhân viên kho 02|warehouse-staff-02@gmail.com|1|0|05-09-2026 15:26|WAREHOUSE_STAFF|Theo chức năng|
warehouse-staff-01|Nhân viên kho 01|warehouse-staff-01@gmail.com|1|0|07-09-2026 22:43|WAREHOUSE_STAFF|Theo chức năng|
warranty-staff-01|Nhân viên bảo hành 01|warranty-staff-01@gmail.com|0|0|07-09-2026 23:01|WARRANTY_STAFF|Theo chức năng|
inbound-only-test-01|Chỉ nhập kho (test) 01|inbound-only-test-01@gmail.com|2|0|06-09-2026 15:13|INBOUND_ONLY_TEST|Theo chức năng|
admin-01|Quản trị viên 01|admin-01@gmail.com|3|0|06-09-2026 15:13|ADMIN|Theo chức năng|
admin-02|Quản trị viên 02|admin-02@gmail.com|3|0|05-09-2026 15:26|ADMIN|Theo chức năng|
admin-03|Quản trị viên 03|admin-03@gmail.com|3|0|04-09-2026 15:39|ADMIN|Theo chức năng|
inbound-only-test-02|Chỉ nhập kho (test) 02|inbound-only-test-02@gmail.com|2|0|05-09-2026 15:26|INBOUND_ONLY_TEST|Theo chức năng|
inbound-only-test-03|Chỉ nhập kho (test) 03|inbound-only-test-03@gmail.com|2|0|04-09-2026 15:39|INBOUND_ONLY_TEST|Theo chức năng|
leadership-02|Ban lãnh đạo 02|leadership-02@gmail.com|3|0|05-09-2026 15:26|LEADERSHIP|Theo chức năng|
leadership-03|Ban lãnh đạo 03|leadership-03@gmail.com|3|0|04-09-2026 15:39|LEADERSHIP|Theo chức năng|
warehouse-approver-01|Người duyệt kho 01|warehouse-approver-01@gmail.com|1|0|01-09-2026 15:25|WAREHOUSE_APPROVER|Theo chức năng|
warehouse-approver-02|Người duyệt kho 02|warehouse-approver-02@gmail.com|1|0|30-08-2026 15:51|WAREHOUSE_APPROVER|Theo chức năng|
warehouse-approver-03|Người duyệt kho 03|warehouse-approver-03@gmail.com|1|0|28-08-2026 15:17|WAREHOUSE_APPROVER|Theo chức năng|
warehouse-keeper-01|Thủ kho 01|warehouse-keeper-01@gmail.com|1|0|29-08-2026 15:04|WAREHOUSE_KEEPER|Theo chức năng|
warehouse-keeper-02|Thủ kho 02|warehouse-keeper-02@gmail.com|1|0|27-08-2026 15:30|WAREHOUSE_KEEPER|Theo chức năng|
warehouse-keeper-03|Thủ kho 03|warehouse-keeper-03@gmail.com|1|0|25-08-2026 15:56|WAREHOUSE_KEEPER|Theo chức năng|
master-manager-01|Quản lý dữ liệu gốc (test) 01|master-manager-01@gmail.com|4|0|06-09-2026 15:13|MASTER_MANAGER|Theo chức năng|
master-manager-02|Quản lý dữ liệu gốc (test) 02|master-manager-02@gmail.com|4|0|05-09-2026 15:26|MASTER_MANAGER|Theo chức năng|
master-manager-03|Quản lý dữ liệu gốc (test) 03|master-manager-03@gmail.com|4|0|04-09-2026 15:39|MASTER_MANAGER|Theo chức năng|
no-permission-01|Không có quyền (test) 01|no-permission-01@gmail.com|2|0|06-09-2026 15:13|NO_PERMISSION|Theo chức năng|
no-permission-02|Không có quyền (test) 02|no-permission-02@gmail.com|2|0|05-09-2026 15:26|NO_PERMISSION|Theo chức năng|
super-admin-01|Quản trị hệ thống 01|super-admin-01@gmail.com|3|0|06-09-2026 15:13|SUPER_ADMIN|Toàn hệ thống|
warehouse-manager-01|Quản lý kho 01|warehouse-manager-01@gmail.com|1|0|07-09-2026 23:06|WAREHOUSE_MANAGER|Theo chức năng|
super-admin-03|Quản trị hệ thống 03|super-admin-03@gmail.com|3|0|04-09-2026 15:39|SUPER_ADMIN|Toàn hệ thống|
viewer-01|Người xem 01|viewer-01@gmail.com|5|0|06-09-2026 15:13|VIEWER|Theo chức năng|
viewer-02|Người xem 02|viewer-02@gmail.com|5|0|05-09-2026 15:26|VIEWER|Theo chức năng|
viewer-03|Người xem 03|viewer-03@gmail.com|5|0|04-09-2026 15:39|VIEWER|Theo chức năng|
warehouse-manager-02|Quản lý kho 02|warehouse-manager-02@gmail.com|1|0|05-09-2026 15:26|WAREHOUSE_MANAGER|Theo chức năng|
danhmuc01|Nguyễn Văn Hùng — Phụ trách danh mục|danhmuc01@gmail.com|4|0|04-09-2026 21:00|MASTER_MANAGER|Theo chức năng|
sku01|Phạm Thị Mai — Phụ trách SKU|sku01@gmail.com|4|0|06-09-2026 22:10|SKU_MANAGER|Theo chức năng|
sku02|Lâm Chí Vỹ — Phụ trách SKU (nghỉ thai sản)|sku02@gmail.com|4|1|29-06-2026 23:20|SKU_MANAGER|Theo chức năng|
warehouse-manager-03|Quản lý kho 03|warehouse-manager-03@gmail.com|1|0|04-09-2026 15:39|WAREHOUSE_MANAGER|Theo chức năng|
super-admin-02|Quản trị hệ thống 02|super-admin-02@gmail.com|3|0|05-09-2026 15:26|SUPER_ADMIN|Toàn hệ thống|
sku-manager-03|Quản lý SKU (test) 03|sku-manager-03@gmail.com|4|0|04-09-2026 15:39|SKU_MANAGER|Theo chức năng|
sku-manager-02|Quản lý SKU (test) 02|sku-manager-02@gmail.com|4|0|05-09-2026 15:26|SKU_MANAGER|Theo chức năng|
sku-manager-01|Quản lý SKU (test) 01|sku-manager-01@gmail.com|4|0|06-09-2026 15:13|SKU_MANAGER|Theo chức năng|
no-permission-03|Không có quyền (test) 03|no-permission-03@gmail.com|2|0|04-09-2026 15:39|NO_PERMISSION|Theo chức năng|
leadership-01|Ban lãnh đạo 01|leadership-01@gmail.com|3|0|07-09-2026 22:48|LEADERSHIP|Theo chức năng|
quanlykho03|Nguyễn Thị Thu — Quản lý kho vùng|quanlykho03@gmail.com|5|0|02-09-2026 16:10|WAREHOUSE_MANAGER|Theo chức năng|
nhanvienkho04|Mai Văn Định — Nhân viên kho (thời vụ)|nhanvienkho04@gmail.com|1|1|02-06-2026 21:30|WAREHOUSE_STAFF|Theo chức năng|
kinhdoanh02|Cao Thị Bích — CV kinh doanh|kinhdoanh02@gmail.com|5|0|30-08-2026 18:30|VIEWER|Theo chức năng|
admin.hethong|Phạm Quốc Bảo — Quản trị hệ thống|admin.hethong@gmail.com|3|0|07-09-2026 18:30|ADMIN|Theo chức năng|
admin.phanquyen|Vũ Thị Ngọc — Quản trị phân quyền|admin.phanquyen@gmail.com|3|0|01-09-2026 19:40|ADMIN|Theo chức năng|
admin.cu|Đỗ Văn Cường — Quản trị (đã nghỉ)|admin.cu@gmail.com|3|1|15-04-2026 20:50|ADMIN|Theo chức năng|
baohanh01|Hoàng Minh Trí — CV bảo hành|baohanh01@gmail.com|0|0|07-09-2026 21:00|WARRANTY_STAFF|Theo chức năng|
baohanh02|Bùi Thị Lan — CV bảo hành|baohanh02@gmail.com|0|0|05-09-2026 22:10|WARRANTY_STAFF|Theo chức năng|
baohanh03|Ngô Hữu Phước — CV bảo hành|baohanh03@gmail.com|0|2|17-08-2026 23:20|WARRANTY_STAFF|Theo chức năng|
duyetkho02|Nguyễn Hữu Lâm — Trưởng ca duyệt phiếu|duyetkho02@gmail.com|1|0|05-09-2026 22:40|WAREHOUSE_APPROVER|Theo chức năng|
duyetkho03|Trần Thị Hường — Duyệt phiếu ca đêm|duyetkho03@gmail.com|1|2|26-08-2026 23:50|WAREHOUSE_APPROVER|Theo chức năng|
quanlykho02|Lê Quang Huy — Quản lý kho chi nhánh|quanlykho02@gmail.com|1|0|07-09-2026 15:00|WAREHOUSE_MANAGER|Theo chức năng|
kythuat.baohanh|Dương Văn Khoa — KTV bảo hành|kythuat.baohanh@gmail.com|4|0|06-09-2026 15:30|WARRANTY_STAFF|Theo chức năng|
kythuat.hientruong|Lý Thành Đạt — KTV hiện trường|kythuat.hientruong@gmail.com|4|1|11-06-2026 16:40|WARRANTY_STAFF|Theo chức năng|
thukho02|Trịnh Văn Sơn — Thủ kho ca 2|thukho02@gmail.com|1|0|07-09-2026 17:50|WAREHOUSE_KEEPER|Theo chức năng|
thukho03|Phan Thị Kim — Thủ kho chi nhánh|thukho03@gmail.com|1|2|05-08-2026 18:00|WAREHOUSE_KEEPER|Theo chức năng|
nhanvienkho02|Võ Thị Cúc — Nhân viên kho|nhanvienkho02@gmail.com|1|0|06-09-2026 19:10|WAREHOUSE_STAFF|Theo chức năng|
nhanvienkho03|Đặng Hoài An — Nhân viên kho|nhanvienkho03@gmail.com|1|0|04-09-2026 20:20|WAREHOUSE_STAFF|Theo chức năng|
kinhdoanh01|Hồ Minh Quân — CV kinh doanh|kinhdoanh01@gmail.com|5|0|06-09-2026 17:20|VIEWER|Theo chức năng|
kinhdoanh03|Đinh Văn Lộc — CV kinh doanh (tạm khoá)|kinhdoanh03@gmail.com|5|2|29-07-2026 19:40|VIEWER|Theo chức năng|
ketoan.kho|Trương Thị Nhung — Kế toán kho|ketoan.kho@gmail.com|3|0|05-09-2026 20:50|VIEWER|Theo chức năng|
giamdoc.hoa|Nguyễn Thị Hoa — Giám đốc|giamdoc.hoa@gmail.com|3|0|06-09-2026 15:00|LEADERSHIP|Theo chức năng|
phogiamdoc.tuan|Trần Anh Tuấn — Phó giám đốc|phogiamdoc.tuan@gmail.com|3|0|03-09-2026 16:10|LEADERSHIP|Theo chức năng|
truongvung.nam|Lê Hoài Nam — Giám đốc vùng Nam|truongvung.nam@gmail.com|5|1|07-07-2026 17:20|LEADERSHIP|Theo chức năng|
inbound-tester01|Test Chỉ nhập kho|inbound-tester01@gmail.com|1|0|31-08-2026 21:25|INBOUND_ONLY_TEST|Theo chức năng|
test-master-manage|Test Quản lý dữ liệu gốc|test-master-manage@gmail.com|4|0|25-08-2026 17:25|MASTER_MANAGER|Theo chức năng|
test-sku-manage|Test Quản lý SKU|test-sku-manage@gmail.com|4|0|27-08-2026 15:25|SKU_MANAGER|Theo chức năng|
test-no-permission|Test Không có quyền|test-no-permission@gmail.com|3|0|20-08-2026 22:25|NO_PERMISSION|Theo chức năng|
test-super-admin|Test Siêu quản trị|test-super-admin@gmail.com|3|0|29-08-2026 23:25|SUPER_ADMIN|Toàn hệ thống|
keeper01|Thủ kho 01|keeper01@gmail.com|1|0|07-09-2026 14:25|WAREHOUSE_KEEPER|Theo chức năng|report.export
viewer01|Người xem 01|viewer01@gmail.com|5|0|03-09-2026 18:25|VIEWER|Theo chức năng|
manager01|Quản lý kho 01|manager01@gmail.com|1|0|05-09-2026 16:25|WAREHOUSE_MANAGER|Theo chức năng|
staff01|Nhân viên kho 01|staff01@gmail.com|1|0|06-09-2026 15:25|WAREHOUSE_STAFF|Theo chức năng|
approver01|Người duyệt kho 01|approver01@gmail.com|1|0|06-09-2026 15:25|WAREHOUSE_APPROVER|Theo chức năng|
admin|Quản trị viên|admin@gmail.com|3|0|08-09-2026 02:23|SUPER_ADMIN|Toàn hệ thống|`
    .split('\n')
    .map((r) => r.split('|'));

// Preserve literal permission codes and CMS labels; identical labels are disambiguated by code.
const permissionRows = `report.export|Xuất dữ liệu · Báo cáo|Báo cáo
report.view|Xem · Báo cáo|Báo cáo
warranty.temp_only|Thực hiện · Bảo hành|Bảo hành
warranty.manage|Quản lý · Bảo hành|Bảo hành
warranty.component_issue|Thực hiện · Bảo hành|Bảo hành
warranty.pii.view|Xem · Bảo hành|Bảo hành
warranty.pii.export|Xuất dữ liệu · Bảo hành|Bảo hành
warranty.view|Xem · Bảo hành|Bảo hành
catalog.view|Xem · Danh mục|Danh mục
catalog.manage|Quản lý · Danh mục|Danh mục
agency.view|Xem · Đối tượng nhận hàng|Đối tượng nhận hàng
agency.manage|Quản lý · Đối tượng nhận hàng|Đối tượng nhận hàng
warehouse.view|Xem · Kho|Kho
warehouse.manage|Quản lý · Kho|Kho
iam.user.manage|Quản lý · Người dùng & phân quyền|Người dùng & phân quyền
iam.role.view|Xem · Người dùng & phân quyền|Người dùng & phân quyền
iam.role.manage|Quản lý · Người dùng & phân quyền|Người dùng & phân quyền
iam.permission.view|Xem · Người dùng & phân quyền|Người dùng & phân quyền
iam.user.view|Xem · Người dùng & phân quyền|Người dùng & phân quyền
label.print|Thực hiện · Nhãn đóng gói|Nhãn đóng gói
label.reprint|Thực hiện · Nhãn đóng gói|Nhãn đóng gói
inbound.post|Hoàn tất · Nhập kho|Nhập kho
inbound.view|Xem · Nhập kho|Nhập kho
inbound.create|Tạo mới · Nhập kho|Nhập kho
inbound.scan|Quét mã · Nhập kho|Nhập kho
inbound.cancel|Hủy · Nhập kho|Nhập kho
scan.inbound|Quét mã · Quét mã|Quét mã|Ngừng hiệu lực — dùng inbound.scan
scan.outbound|Quét mã · Quét mã|Quét mã|Ngừng hiệu lực — dùng outbound.scan
scan.warranty|Quét mã · Quét mã|Quét mã|Ngừng hiệu lực — dùng warranty.view
scan.execute|Quét mã · Quét mã|Quét mã
scan.classify|Quét mã · Quét mã|Quét mã
packing_label.preview|Thực hiện · Chức năng|Quyền hệ thống khác
packing_label.ready|Thực hiện · Chức năng|Quyền hệ thống khác
packing_label.print|Thực hiện · Chức năng|Quyền hệ thống khác
packing_label.reprint|Thực hiện · Chức năng|Quyền hệ thống khác
import_batch.view|Xem · Chức năng|Quyền hệ thống khác
import_batch.manage|Quản lý · Chức năng|Quyền hệ thống khác
physical_code.assign_rfid|Thực hiện · Chức năng|Quyền hệ thống khác
physical_code.create|Tạo mới · Chức năng|Quyền hệ thống khác
item_instance.view|Xem · Chức năng|Quyền hệ thống khác
item_instance.manage|Quản lý · Chức năng|Quyền hệ thống khác
audit_log.view|Xem · Chức năng|Quyền hệ thống khác
audit_log.view_all|Thực hiện · Chức năng|Quyền hệ thống khác
defect.view|Xem · Chức năng|Quyền hệ thống khác
defect.manage|Quản lý · Chức năng|Quyền hệ thống khác
sku.view|Xem · SKU & sản phẩm|SKU & sản phẩm
sku.manage|Quản lý · SKU & sản phẩm|SKU & sản phẩm
inventory.view|Xem · Tồn kho|Tồn kho
inventory.reversal.post|Hoàn tất · Tồn kho|Tồn kho
inventory.trace|Truy vết · Tồn kho|Tồn kho
pv.master.manage|Quản lý · Ứng dụng phân vùng|Ứng dụng phân vùng
pv.publish|Đưa lên ứng dụng · Ứng dụng phân vùng|Ứng dụng phân vùng
container.view|Xem · Vật chứa|Vật chứa
container.manage|Quản lý · Vật chứa|Vật chứa
putaway.view|Xem · Xếp khay|Xếp khay
putaway.manage|Quản lý · Xếp khay|Xếp khay
outbound.request.import|Nhập dữ liệu · Xuất kho|Xuất kho
outbound.request.confirm|Thực hiện · Xuất kho|Xuất kho
outbound.request.manual_create|Thực hiện · Xuất kho|Xuất kho
outbound.view|Xem · Xuất kho|Xuất kho
outbound.import|Nhập dữ liệu · Xuất kho|Xuất kho
outbound.scan|Quét mã · Xuất kho|Xuất kho
outbound.cancel|Hủy · Xuất kho|Xuất kho
outbound.post|Hoàn tất · Xuất kho|Xuất kho`;
const permissions: Permission[] = permissionRows.split('\n').map((line) => {
  const [code, name, group, reason = ''] = line.split('|');
  return { code, name, group, restricted: !!reason, reason };
});
const roleRows = `INBOUND_ONLY_TEST|Chỉ nhập kho (Test)|4|report.view catalog.view warehouse.view label.print label.reprint inbound.post inbound.view inbound.create inbound.scan inbound.cancel scan.execute import_batch.view physical_code.assign_rfid physical_code.create item_instance.view item_instance.manage sku.view inventory.view inventory.reversal.post inventory.trace container.view container.manage putaway.view putaway.manage
NO_PERMISSION|Không có quyền (Test)|4|
SKU_MANAGER|Quản lý SKU (Test)|6|catalog.view sku.view sku.manage
MASTER_MANAGER|Quản lý dữ liệu gốc (Test)|5|catalog.view catalog.manage
WAREHOUSE_MANAGER|Quản lý kho|6|report.export report.view warranty.view catalog.view agency.view warehouse.view inbound.view import_batch.view item_instance.view audit_log.view defect.view sku.view inventory.view inventory.trace container.view putaway.view outbound.view
WAREHOUSE_KEEPER|Thủ kho (ngừng dùng)|6|report.view warranty.manage warranty.component_issue warranty.view catalog.view warehouse.view label.print label.reprint inbound.post inbound.view inbound.create inbound.scan inbound.cancel scan.inbound scan.outbound scan.execute packing_label.preview packing_label.ready packing_label.print packing_label.reprint import_batch.view physical_code.assign_rfid physical_code.create item_instance.view item_instance.manage sku.view inventory.view inventory.reversal.post inventory.trace container.view container.manage putaway.view putaway.manage outbound.request.import outbound.request.confirm outbound.request.manual_create outbound.view outbound.import outbound.scan outbound.cancel outbound.post
WARRANTY_STAFF|Nhân viên bảo hành|8|warranty.temp_only warranty.manage warranty.component_issue warranty.pii.view warranty.view catalog.view warehouse.view scan.execute scan.classify item_instance.view sku.view inventory.view inventory.trace
LEADERSHIP|Ban lãnh đạo|6|report.view warranty.view catalog.view agency.view warehouse.view inbound.view defect.view sku.view inventory.view inventory.trace putaway.view outbound.view
VIEWER|Người xem|8|report.view catalog.view agency.view warehouse.view inbound.view import_batch.view item_instance.view defect.view sku.view inventory.view inventory.trace container.view putaway.view outbound.view
WAREHOUSE_APPROVER|Người duyệt kho (ngừng dùng)|6|report.view warranty.view catalog.view agency.view warehouse.view inbound.post inbound.view inbound.cancel import_batch.view item_instance.view defect.view sku.view inventory.view inventory.trace container.view putaway.view outbound.view outbound.cancel outbound.post
ADMIN|Quản trị viên|6|report.export report.view warranty.temp_only warranty.manage warranty.component_issue warranty.pii.view warranty.view catalog.view catalog.manage agency.view agency.manage warehouse.view warehouse.manage iam.user.manage iam.role.view iam.role.manage iam.permission.view iam.user.view label.print label.reprint inbound.post inbound.view inbound.create inbound.scan inbound.cancel scan.execute scan.classify packing_label.preview packing_label.ready packing_label.print packing_label.reprint import_batch.view import_batch.manage physical_code.assign_rfid physical_code.create item_instance.view item_instance.manage audit_log.view audit_log.view_all defect.view defect.manage sku.view sku.manage inventory.view inventory.reversal.post inventory.trace pv.master.manage pv.publish container.view container.manage putaway.view putaway.manage outbound.request.import outbound.request.confirm outbound.request.manual_create outbound.view outbound.import outbound.scan outbound.cancel outbound.post
SUPER_ADMIN|Quản trị hệ thống|5|
WAREHOUSE_STAFF|Nhân viên kho|7|report.view catalog.view agency.view warehouse.view inbound.post inbound.view inbound.create inbound.scan inbound.cancel scan.execute packing_label.preview packing_label.ready packing_label.print packing_label.reprint import_batch.view item_instance.view defect.view sku.view inventory.view inventory.trace container.view putaway.view putaway.manage outbound.request.import outbound.request.confirm outbound.request.manual_create outbound.view outbound.scan outbound.cancel outbound.post`;
const roles: Role[] = roleRows.split('\n').map((line) => {
  const [code, name, count, codes] = line.split('|');
  return {
    code,
    name,
    assignedUserCount: Number(count),
    permissions: codes ? codes.split(' ') : [],
    locked: code === 'SUPER_ADMIN',
    effectiveUnresolved: code === 'SUPER_ADMIN',
  };
});

export function createCmsSnapshot(): RbacDataset {
  return {
    accounts: rows.map(([username, name, email, , status]) => ({
      username,
      name,
      email,
      status: statuses[Number(status)],
      managementClassification: null,
    })),
    departments: Object.fromEntries(
      rows.map(([username, , , department]) => [
        username,
        departments[Number(department)],
      ]),
    ),
    authAudit: Object.fromEntries(
      rows.map(([username, , , , , lastLogin]) => [username, lastLogin]),
    ),
    assignments: rows.map(([username, , , , , , roleCode, scope]) => ({
      username,
      roleCode,
      scope,
      validity: 'Vô thời hạn',
    })),
    overrides: Object.fromEntries(
      rows.map(([username, , , , , , , , codes]) => [
        username,
        codes ? codes.split(',') : [],
      ]),
    ),
    permissions: permissions.map((p) => ({ ...p })),
    roles: roles.map((r) => ({ ...r, permissions: [...r.permissions] })),
  };
}
