<template>
    <div class="category-container container mt-4">
        <h1>Danh sách danh mục</h1>
        <CategoryTree @addCategory="openAddCategory" @showCategoryInfo="openUpdateCategory" :categories="categories" />
        <details class="tree-nav__item">
            <summary class="tree-nav__item-title add__category_btn" @click="openAddCategory(null)"> Thêm danh mục <svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            </summary>
        </details>
        <v-dialog v-model="categoryShow.add" min-width="500" width="auto">
            <v-card max-width="500" title="Thêm thể loại">
                <template v-slot:text>
                    <div class="text-subtitle-1 text-medium-emphasis">Tên thể loại</div>
                    <v-text-field v-model="category.tenLoai" density="compact" placeholder="..."
                        prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>
                    <v-textarea v-model="category.moTa" bg-color="amber-lighten-4" color="orange orange-darken-4"
                        label="Mô tả (Không bắt buộc)"></v-textarea>
                </template>
                <template v-slot:actions>
                    <div class="d-flex justify-content-between align-items-center">
                        <v-btn class="ms-auto me-2" color="red" @click="categoryShow.add = false">
                            Thoát
                        </v-btn>
                        <v-btn text="OK" class="ms-auto" color="primary" @click="addCategory">
                            OK <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-card>
        </v-dialog>
        <!--info and update -->
        <v-dialog v-model="categoryShow.info" min-width="300" width="auto">
            <v-card max-width="700" :title="currentTitle">
                <template v-slot:text>
                    <v-window max-width="700" v-model="step">
                        <v-window-item :value="1">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="text-primary text-subtitle-1 text-medium-emphasis">Tên thể loại</div>
                                <div>{{ updateCategory.tenLoai }}</div>
                            </div>
                            <div class="d-flex justify-content-between flex-column">
                                <div class="text-primary fw-bold text-subtitle-1 text-medium-emphasis">Mô tả</div>
                                <div>{{ updateCategory.moTa || "Không có" }}</div>
                            </div>
                        </v-window-item>
                        <v-window-item min-width="500" :value="2">
                            <div class="text-subtitle-1 text-medium-emphasis">Tên thể loại</div>
                            <v-text-field v-model="updateCategory.tenLoai" density="compact" placeholder="..."
                                prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>
                            <v-textarea v-model="updateCategory.moTa" bg-color="amber-lighten-4"
                                color="orange orange-darken-4" label="Mô tả (Không bắt buộc)"></v-textarea>
                            <div class="text-subtitle-1 text-medium-emphasis">Thể loại phụ thuộc</div>
                            <v-btn size="large" @click="showCategoryList = true">Chọn thể loại phụ thuộc</v-btn>
                            <div class="w-100 mt-2 text-center fw-bold">{{ categoryShow.category?.tenLoai || 'Không có'
                                }}</div>
                        </v-window-item>
                    </v-window>
                </template>
                <template v-slot:actions>
                    <div class="d-flex justify-content-between align-items-center">
                        <v-btn v-if="step == 1" class="ms-auto me-2" color="red" @click="step = 2">
                            Cập nhật
                        </v-btn>
                        <v-btn v-if="step == 1" class="ms-auto me-2" color="orange" @click="delCategory">
                            Xóa
                        </v-btn>
                        <v-btn v-if="step == 2" class="ms-auto" color="primary" @click="step = 1">Thoát</v-btn>
                        <v-btn v-if="step == 2" class="ms-auto" color="primary" @click="updateCategoryInfo">
                            OK <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showCategoryList" max-width="1200">
            <v-card title="Danh sách thể loại">
                <template v-slot:text>
                    <ul class="menu">
                        <ListCategory v-for="c in categories" :item="c" :key="c.maLoai" :single="true"
                            :initial="choosedCategory">
                        </ListCategory>
                    </ul>
                </template>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Thoát" variant="text" @click="showCategoryList = false"></v-btn>
                    <v-btn text="Chọn" variant="text" @click="updateSelectedCategory"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup>
import ListCategory from '../ListCategory.vue';
import CategoryTree from './CategoryTree.vue';
import { getCategory } from '@/data.function/getData';
import { deleteCategory, insertCategory, updateCategory as updateCat, updateOutfit } from '@/data.function/postData';
import { Toast } from '@/utils/notification';
import { findCategoryById } from '@/utils/util.function';
import { onBeforeMount, ref, reactive, computed } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';

const adminStore = useAdminStore();
const { choosedCategory } = storeToRefs(adminStore);
const step = ref(1);
const showCategoryList = ref(false);
const categories = ref([])
const categoryShow = reactive({
    info: false,
    add: false,
    data: {},
    category: null
})
onBeforeMount(async () => {
    const response = await getCategory();
    if (response) categories.value = response;
    else {
        console.log('Error fetching data')
    }
})
const currentTitle = computed(() => {
    switch (step.value) {
        case 1:
            return 'Thông tin thể loại'
        case 2:
            return 'Cập nhật thể loại'
    }
})
const category = reactive({
    id: 0,
    tenLoai: "",
    moTa: "",
    forAccessary: false,
    parentId: null
})
const updateCategory = reactive({
    id: 0,
    tenLoai: "",
    moTa: "",
    forAccessary: false,
    parentId: null,
    children: null
})
const openAddCategory = (id, forAccessary = false) => {
    categoryShow.add = true;
    category.parentId = id;
    category.forAccessary = forAccessary;
}
const openUpdateCategory = (cat) => {
    categoryShow.info = true;
    categoryShow.data = cat;
    if (!cat.parentId) categoryShow.category = null;
    else if (categories.value.length > 0)
        categories.value.forEach(item => {
            if (!categoryShow.category) categoryShow.category = findCategoryById(item, cat.parentId);
        })
    if (categoryShow.category)
        choosedCategory.value.push(JSON.parse(JSON.stringify(categoryShow.category)))
    else {
        choosedCategory.value = [];
    }
    updateCategory.tenLoai = cat.tenLoai;
    updateCategory.moTa = cat.moTa;
    updateCategory.id = cat.maLoai;
    updateCategory.forAccessary = cat.forAccessary;
    updateCategory.parentId = cat.parentId;
    updateCategory.children = cat.children;
}
const isValid = computed(() => {
    return category.tenLoai.trim() !== "";
})
const addCategory = () => {
    if (!isValid.value) {
        Toast.fire({
            icon: 'warning',
            title: 'Vui lòng nhập tên thể loại!'
        })
        return;
    }
    console.log(category);
    insertCategory(category).then(result => {
        if (result) {
            categoryShow.add = false;
            if (category.parentId == null) {
                categories.value.push(result);
            } else {
                let inserted = ref(null);
                categories.value.forEach(item => {
                    if (inserted.value == null) inserted.value = findCategoryById(item, category.parentId);
                })
                if (!inserted.value.children) inserted.value.children = [];
                inserted.value.children.push(result);
            }
            category.tenLoai = "";
            category.moTa = "";
            category.parentId = null;
        }
        Toast.fire({
            icon: !result ? 'warning' : 'info',
            title: !result ? 'Thêm thất bại !' : 'Thêm thành công !'
        })
    })
}
const updateSelectedCategory = () => {
    categoryShow.category = choosedCategory.value[0] ? JSON.parse(JSON.stringify(choosedCategory.value[0])) : null;
    showCategoryList.value = false;
}
const updateCategoryInfo = () => {
    if (updateOutfit.tenLoai == "") {
        Toast.fire({
            icon: 'warning',
            title: 'Vui lòng nhập tên thể loại!'
        })
        return;
    }
    if (categoryShow.category && categoryShow.category.maLoai != category.maLoai) {
        updateCategory.forAccessary = categoryShow.category.forAccessary;
        updateCategory.parentId = categoryShow.category.maLoai;
    }
    updateCat(updateCategory).then(res => {
        if (res) {
            //TODO: thêm cập nhật ở đây. bí quá thì load lại trang
            resetUpdateCategory()
        }
        Toast.fire({
            icon: !res ? 'warning' : 'info',
            title: !res ? 'Cập nhật thất bại!' : 'Cập nhật thành công!'
        })
        setTimeout(()=> {
            window.location.reload()
        },2000)
    })
}
const delCategory = () => {
    if (updateCategory.children) {
        (async () => {
            const { value: confirm } = await Swal.fire({
                title: 'Thông báo',
                text: "Bạn có muốn xóa tất cả các thể loại thấp hơn không?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Đồng ý'
            })
            const { value: accept } = await Swal.fire({
                title: 'Thông báo',
                text: "Bạn có thật sự muốn xóa ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Đồng ý'
            })
            if (accept) {
                const response = await deleteCategory(updateCategory.id, confirm)
                if (response) {
                    // TODO: thêm cập nhật ở đây. bí quá thì load lại trang
                    let deleteCat = ref(null);
                    if(!updateCategory.parentId) categories.value = categories.value.filter(item=> item.maLoai != updateCategory.id)
                else 
                categories.value.forEach(item => {
                    if (deleteCat.value == null) deleteCat.value = findCategoryById(item, updateCategory.parentId);
                })
            if(deleteCat.value !=null) deleteCat.value.children = deleteCat.value.children.filter(item => item.maLoai !=updateCategory.id)
                    resetUpdateCategory()
                    Toast.fire({
                        icon: 'success',
                        title: 'Xóa thành công!'
                    })
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Xóa thất bại!'
                    })

                }
            }
        })()
    } else {
        (async () => {
            const { value: accept } = await Swal.fire({
                title: 'Thông báo',
                text: "Bạn có thật sự muốn xóa ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Đồng ý'
            })
            if (accept) {
                deleteCategory(updateCategory.id, false).then(res => {
                    if (res) {
                        // TODO: thêm cập nhật ở đây. bí quá thì load lại trang
                        let deleteCat = ref(null);
                    if(!updateCategory.parentId) categories.value = categories.value.filter(item=> item.maLoai != updateCategory.id)
                else 
                categories.value.forEach(item => {
                    if (deleteCat.value == null) deleteCat.value = findCategoryById(item, updateCategory.parentId);
                })
            if(deleteCat.value !=null) deleteCat.value.children = deleteCat.value.children.filter(item => item.maLoai !=updateCategory.id)
                        resetUpdateCategory()
                        Toast.fire({
                            icon: 'success',
                            title: 'Xóa thành công!'
                        })
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Xóa thất bại!'
                        })
                    }
                })
            }
        })()

    }
}
const resetUpdateCategory = () => {
    updateCategory.id = 0;
    updateCategory.tenLoai = "";
    updateCategory.moTa = "";
    updateCategory.forAccessary = false;
    updateCategory.parentId = null;
    categoryShow.category = null;
}
</script>
<style scoped>
.category-container h1 {
    font-size: 2.3rem;
    color: orange;
}

ul.menu {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    flex-direction: column;
}

ul.menu>li> {
    display: inline-block;
    margin: 0 12px;
    font-weight: 500;
}

.menu {
    margin: 0;
}

.menu li {
    cursor: pointer;
}
</style>