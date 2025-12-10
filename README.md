<p align="center">
  <a href="https://vendure.io">
    <img alt="Vendure logo" height="60" width="auto" src="https://a.storyblok.com/f/328257/699x480/8dbb4c7a3c/logo-icon.png">
  </a>
</p>

<h1 align="center">
  Product Status Board – Vendure Admin Plugin
</h1>
<h3 align="center">
    A custom UI plugin for Vendure Admin that provides a grid-based product status dashboard with real-time grouping, quick actions, and improved visibility for product inventory & enabled status.
</h3>

## 1. Overview

The Product Status Board plugin bổ sung một màn hình mới trong Vendure Admin, giúp quản trị viên xem nhanh trạng thái của toàn bộ sản phẩm dựa trên các thông tin thực tế như:

- **Enabled / Disabledn**

- **Inventory (In Stock / Low Stock / Out of Stock)**

- **Asset thumbnail**: API-first design enables seamless multichannel commerce across any frontend

- **Grouping theo trạng thái**: Trusted by thousands of teams worldwide, from startups to Fortune 500 companies

Plugin đồng thời hỗ trợ thao tác nhanh (quick edit) và đảm bảo UI cập nhật ngay (TanStack React Query).

## 2. Features

**2.1 Plugin & Routing**

- Tạo UI Plugin mới cho Vendure Admin theo chuẩn plugin system.

- Thêm menu item mới trên sidebar: **Product Status Board**.

- Tạo routing riêng **/product-status-board**.

**2.2 Fetch Data từ GraphQL**

- Gọi query products với các trường:
    - **id, name, slug**

    - **createdAt.**

    - **variants.stockLevel.**

    - **Thumbnail asset.**

**2.3 Mapping trạng thái**

- Ánh xạ sản phẩm thành 4 nhóm:
    - **1. Active** – enabled = true & stock > threshold

    - **2. Low Stock** – enabled = true & stock trong ngưỡng thấp

    - **3. Out of Stock** – stock = 0

    - **4. Disabled** – enabled = false

**2.4 UI / UX**

- Hiển thị dạng **grid**, mỗi sản phẩm là **card**.

- Card gồm.
    - Thumbnail

    - Name

    - Slug

    - Status badge

    - Stock info

    - Enabled toggle

    - Button "Open in product detail"

- Nhấn vào button sẽ deep link tới màn product detail mặc định của Vendure.

**2.5 Quick Actions**

- **Toggle enabled** (mutation → update cache bằng TanStack Query).

**2.6 UI States**

- Tất cả trạng thái bắt buộc đã được implement:

| State           | Mô tả                                       |
| --------------- | ------------------------------------------- |
| **Loading**     | Skeleton grid / Loading spinner             |
| **Error**       | Hiển thị error message + nút Retry          |
| **Empty state** | Hiển thị khi search/filter không có kết quả |

**2.6 Code Quality**

- Component tách nhỏ: ProductCard, ErrorProductsStatusBoard, ProductFilter, ProductContentContainer, ProductContent, ProductPagination...

- Logic tách riêng tương ứng theo các nhiệm vụ tương ứng
    - product-status-board.graphql

    - product-status-board.hooks

    - product-status-board.schema

    - product-status-board.services

    - product-status-board.types

    - product-status-board.utils

- UI consistency bằng TailwindCSS.

- Không trùng lặp logic, dễ đọc và dễ mở rộng.
