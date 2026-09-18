---
title: Capacitor Bank
---

|                                    Case 1 : Có một MSB.                                    |                                             Case 2 : Có hơn hai MSB.                                              |
| :----------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: |
|                              ![[Capacitor Bank - Case 1.png]]                              |                                         ![[Capacitor Bank - Case 2.png]]                                          |
| Trường hợp này tụ bù sẽ lấy dòng từ MCT được lắp bên nhánh Incoming từ vị trí máy biến áp. | Trường hợp này này tụ bù của 2 bên MSB sẽ lấy dòng từ MCT được lắp trên thanh cái được lắp với nhau bằng Coupler. |
- Trong phần lớn các hệ thống có một MSB hoặc nhiều MSB mà không được nối lại với nhau sẽ sử dụng Case 1, trực tiếp do dòng cho tụ bù từ nhánh Incoming từ máy biến áp. Nhưng khi xảy ra sự cố trên nhánh Incoming đó thì tụ bù sẽ bị vô hiệu hoá, mặc dù cho hệ thống vẫn được cấp nguồn từ máy phát vì do không còn dòng điện đi qua MCT của tụ bù nữa. 

- Đối với Case 2, có nhiều hơn từ hai MSB đang được nối với nhau đồng thời MCT của tụ bù đang được lắp trên thanh cái. Khi một trong hai máy biến áp có sự cố → Coupler đóng lại để máy biến áp còn lại cấp điện cho thanh cái mà máy đang gặp sự cố thì lúc này trên hai thanh cái đều có điện và hai MCT của tụ bù đang được lắp trên thanh cái vẫn có thể hoạt động bình thường và sẽ bù liên tục để luôn đảm bảo cosφ. (Đặc biệt lưu ý là MCT của tụ bù luôn luôn phải nằm trước các tải để dòng điện lúc cấp cho tải luôn luôn đi qua MCT).

- Trường hợp sử dụng hơn hai tủ MSB và được backup nhau bằng Coupler thì hệ thống tụ bù chỉ cần bù theo tải hoặc bằng 80% công xuất của máy biến áp để tiết kiệm chi phí.

---
