let autocomplete;
let map;
let lat = ajax_object.lat;
let lng = ajax_object.lng;
const itemsLista = Object.values(ajax_object.imoveis);
const todosImoveis = itemsLista;
const allInfoWindows = [];
const markers = {};
let maskTelefone = null;
let maskWhatsApp = null;
let maskPrice = null;
let maskPriceSimulador = null;
let maskPoupancaSimulador = null;

(() => {
    'use strict';

    function mi_show_alert(alertPlaceholder, message, type) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('mt-3');
        wrapper.innerHTML = [
            `<div id="contact-form-alert" class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        alertPlaceholder.append(wrapper);
    }

    function miFormsValidation() {
        const forms = document.querySelectorAll('.needs-validation');

        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {

                if (event.submitter.name !== 'previous-step' && !form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                if (event.submitter.name !== 'previous-step') {
                    form.classList.add('was-validated');
                }
            }, false);
        });
    }

    function miNewsletterForm() {
        const newsletterForms = document.querySelectorAll('.mi-newsletter-form');
        newsletterForms.forEach(newsletterForm => {
            newsletterForm.addEventListener('submit', e => {
                e.preventDefault();

                if (typeof document.getElementById('newsletter-form-alert') !== undefined && document.getElementById('newsletter-form-alert')) {
                    const newsletterFormAlert = bootstrap.Alert.getOrCreateInstance('#newsletter-form-alert');
                    newsletterFormAlert.close();
                }

                if (!newsletterForm.checkValidity()) {
                    return;
                }
                newsletterForm.classList.add('was-validated');

                const emailInput = newsletterForm.querySelector('#email');
                const btn = newsletterForm.querySelector('button');

                if (typeof btn === undefined || !btn) {
                    return;
                }

                if (btn.disabled) {
                    return;
                }
                btn.disabled = true;
                const originalBtnHtml = btn.innerHTML;
                btn.innerHTML = 'Enviando...';

                const ajaxUrl = ajax_object.ajax_url;
                const data = new FormData(newsletterForm);
                const action = data.get('action');
                const alertPlaceholder = document.getElementById('newsletter-form-alert-placeholder');

                fetch(ajaxUrl, {
                    method: 'POST',
                    body: data
                })
                    .then((response) => response.json())
                    .then((response) => {

                        mi_show_alert(alertPlaceholder, response.data.msg, 'success');
                        emailInput.value = '';
                    })
                    .catch((error) => {
                        mi_show_alert(alertPlaceholder, error, 'danger');
                    })
                    .finally(() => {
                        btn.disabled = false;
                        btn.innerHTML = originalBtnHtml;
                        newsletterForm.classList.remove('was-validated');
                    });

            });
        });
    }

    function miArchiveLayout() {
        const archiveLayoutWrappers = document.querySelectorAll('.archive-layout');
        archiveLayoutWrappers.forEach(archiveLayoutWrapper => {
            const navLinkItems = archiveLayoutWrapper.querySelectorAll('.nav-link-item');
            navLinkItems.forEach(navLinkItem => {
                navLinkItem.addEventListener('shown.bs.tab', event => {
                    const newLayout = event.target.getAttribute('data-layout');
                    // Atualiza o link do navegador
                    const currUrl = new URL(window.location.href);
                    if (newLayout === 'grid') {
                        currUrl.searchParams.delete('layout');
                    } else {
                        currUrl.searchParams.set('layout', newLayout);
                    }
                    window.history.pushState({}, '', currUrl);

                    // Atualiza os links da paginação
                    const paginations = document.querySelectorAll('.wd-navigation');
                    paginations.forEach(pagination => {
                        const paginationLinks = pagination.querySelectorAll('a');
                        paginationLinks.forEach(paginationLink => {
                            const paginationUrl = new URL(paginationLink.href);
                            if (newLayout === 'grid') {
                                paginationUrl.searchParams.delete('layout');
                            } else {
                                paginationUrl.searchParams.set('layout', newLayout);
                            }
                            paginationLink.href = paginationUrl.toString();
                        });
                    });
                });
            });
        });
    }

    function miArchiveSort() {
        const archiveSortWrappers = document.querySelectorAll('.archive-sort');
        archiveSortWrappers.forEach(archiveSortWrapper => {
            const lists = archiveSortWrapper.querySelectorAll('ul');
            lists.forEach(list => {
                const listItems = list.querySelectorAll('li');
                listItems.forEach(listItem => {
                    listItem.addEventListener('click', (e) => {
                        const orderBy = e.target.getAttribute('data-value');
                        const currUrl = new URL(window.location.href);
                        if (!orderBy) {
                            currUrl.searchParams.delete('orderby');
                        } else {
                            currUrl.searchParams.set('orderby', orderBy);
                        }
                        window.history.pushState({}, '', currUrl);
                        window.location = currUrl;
                    });
                });
            });
        });
    }

    function miMyImoveisSort() {
        const archiveSortWrappers = document.querySelectorAll('.my-imoveis-select');
        archiveSortWrappers.forEach(archiveSortWrapper => {
            const lists = archiveSortWrapper.querySelectorAll('ul');
            lists.forEach(list => {
                const listItems = list.querySelectorAll('li');
                listItems.forEach(listItem => {
                    listItem.addEventListener('click', (e) => {
                        const orderBy = e.target.getAttribute('data-value');
                        const currUrl = new URL(window.location.href);
                        if (!orderBy) {
                            currUrl.searchParams.delete('orderby');
                        } else {
                            currUrl.searchParams.set('orderby', orderBy);
                        }
                        window.history.pushState({}, '', currUrl);
                        window.location = currUrl;
                    });
                });
            });
        });
    }

    function miRemoveClassFromItems(listArray, cssClass) {
        listArray.forEach(item => {
            item.classList.remove(cssClass);
        });
    }

    function miOperacaoFilter() {
        const operacaoList = document.getElementById('operacao-filter');
        if (typeof operacaoList === undefined || !operacaoList) {
            return;
        }
        const operacaoTermInput = document.getElementById('operacao-term');
        if (typeof operacaoTermInput === undefined || !operacaoTermInput) {
            return;
        }
        const operacaoListItems = operacaoList.querySelectorAll('.nav-link-item');
        operacaoListItems.forEach(listItem => {
            listItem.addEventListener('click', e => {
                e.preventDefault();
                console.log('nav-link-item');

                const selectedTermId = listItem.getAttribute('data-term-id');
                miRemoveClassFromItems(operacaoListItems, 'active');
                listItem.classList.add('active');
                operacaoTermInput.value = selectedTermId;
            });
        });
    }

    function miSelectList() {
        const selectLists = document.querySelectorAll('.select-list');
        selectLists.forEach(selectList => {
            const input = selectList.querySelector('[data-select-list-value]');
            const selectListsItems = selectList.querySelectorAll('li');
            selectListsItems.forEach(selectListsItem => {
                selectListsItem.addEventListener('click', () => {
                    console.log('selectLists click');

                    const selectedValue = selectListsItem.getAttribute('data-value');
                    const selectedTermId = selectListsItem.getAttribute('data-term-id');
                    if (typeof input !== undefined && input) {
                        input.value = selectedTermId;
                        console.log('click', selectedTermId);
                    }
                });
            });
        });
    }

    function tooglePreviewContent() {
        const togglePreviews = document.querySelectorAll('.toogle-preview');

        togglePreviews.forEach((previewContent) => {
            const imovelContent = previewContent.querySelector('.imovel-content');
            console.log('imovelContent', imovelContent.offsetHeight);
            const tooglePreviewContent = previewContent.querySelector('.toogle-preview-content');
            const togglebtn = previewContent.querySelector('.toogle-preview-btn');
            if (imovelContent.offsetHeight >= 80) {
                togglebtn.addEventListener('click', e => {
                    e.preventDefault();
                    const previousText = togglebtn.innerText;
                    const newText = togglebtn.getAttribute('data-text');
                    const anchorId = togglebtn.getAttribute('data-anchor');
                    const anchorDiv = document.getElementById(anchorId);
                    const spanText = togglebtn.querySelector('.text');
                    tooglePreviewContent.classList.toggle('expanded');
                    spanText.innerText = newText;
                    togglebtn.setAttribute('data-text', previousText);
                    if (!tooglePreviewContent.classList.contains('expanded') && (typeof anchorDiv !== undefined && anchorDiv)) {
                        anchorDiv.scrollIntoView();
                    }
                });
            } else {
                togglebtn.remove();
                tooglePreviewContent.classList.toggle('expanded');
            }
        });
    }

    function miAnuncianteContactForm() {
        const contactForms = document.querySelectorAll('.mi-anunciante-contact-form');
        contactForms.forEach(contactForm => {
            contactForm.addEventListener('submit', e => {
                e.preventDefault();

                if (typeof document.getElementById('anunciante-contact-form-alert') !== undefined && document.getElementById('anunciante-contact-form-alert')) {
                    const contactFormAlert = bootstrap.Alert.getOrCreateInstance('#anunciante-contact-form-alert');
                    contactFormAlert.close();
                }

                if (!contactForm.checkValidity()) {
                    return;
                }
                contactForm.classList.add('was-validated');

                const nomeInput = contactForm.querySelector('#nome');
                const phoneInput = contactForm.querySelector('#phone');
                const emailInput = contactForm.querySelector('#email');
                const mensagemTextarea = contactForm.querySelector('#mensagem');
                const btn = contactForm.querySelector('button');

                if (typeof btn === undefined || !btn) {
                    return;
                }

                if (btn.disabled) {
                    return;
                }
                btn.disabled = true;
                const originalBtntext = btn.innerText;
                btn.innerText = 'Enviando...';

                const ajaxUrl = ajax_object.ajax_url;
                const data = new FormData(contactForm);
                const action = data.get('action');
                const alertPlaceholder = document.getElementById('anunciante-contact-form-alert-placeholder');

                fetch(ajaxUrl, {
                    method: 'POST',
                    body: data
                })
                    .then((response) => response.json())
                    .then((response) => {

                        mi_show_alert(alertPlaceholder, response.data.msg, 'success');
                        nomeInput.value = '';
                        phoneInput.value = '';
                        emailInput.value = '';
                        mensagemTextarea.value = '';
                    })
                    .catch((error) => {
                        mi_show_alert(alertPlaceholder, error, 'danger');
                    })
                    .finally(() => {
                        btn.disabled = false;
                        btn.innerText = originalBtntext;
                        contactForm.classList.remove('was-validated');
                    });

            });
        });
    }

    function miGoBackBtn() {
        const goBackBtns = document.querySelectorAll('.go-back-btn');
        Array.from(goBackBtns).forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                history.back();
            });
        });
    }

    // Verifica a Força da senha
    function miPasswordStrength() {
        const passwordInput = document.getElementById('user_pass');
        if (typeof passwordInput === undefined || !passwordInput) {
            return;
        }
        const meterSections = document.querySelectorAll('.meter-section');
        if (meterSections.length <= 0) {
            return;
        }

        passwordInput.addEventListener('keyup', () => miUpdateMeter(passwordInput, meterSections));
    }

    // Atualiza o medidor de força da senha
    function miUpdateMeter(passwordInput, meterSections) {

        const password = passwordInput.value;
        let strength = miCalculatePasswordStrength(password);

        meterSections.forEach((section) => {
            section.classList.remove('weak', 'medium', 'strong', 'very-strong');
        });

        if (strength >= 1) {
            meterSections[0].classList.add('weak');
        }
        if (strength >= 2) {
            meterSections[1].classList.add('medium');
        }
        if (strength >= 3) {
            meterSections[2].classList.add('strong');
        }
        if (strength >= 4) {
            meterSections[3].classList.add('very-strong');
        }
        console.log('strength', strength);

    }

    // Calcula a força da senha
    function miCalculatePasswordStrength(password) {
        const lengthWeight = 0.2;
        const uppercaseWeight = 0.5;
        const lowercaseWeight = 0.5;
        const numberWeight = 0.7;
        const symbolWeight = 1;

        let strength = 0;

        // Calculate the strength based on the password length
        strength += password.length * lengthWeight;

        // Calculate the strength based on uppercase letters
        if (/[A-Z]/.test(password)) {
            strength += uppercaseWeight;
        }

        // Calculate the strength based on lowercase letters
        if (/[a-z]/.test(password)) {
            strength += lowercaseWeight;
        }

        // Calculate the strength based on numbers
        if (/\d/.test(password)) {
            strength += numberWeight;
        }

        // Calculate the strength based on symbols
        if (/[^A-Za-z0-9]/.test(password)) {
            strength += symbolWeight;
        }
        return strength;
    }

    // Máscaras dos campos
    function inputMasks() {
        const inputUserTelefone = document.getElementById('user_phone');
        const maskOptionsUserTelefone = {
            mask: '+00[000000000000]'
        };
        if (typeof inputUserTelefone !== undefined && inputUserTelefone) {
            maskTelefone = IMask(inputUserTelefone, maskOptionsUserTelefone);
        }

        const inputWhatsApp = document.getElementById('user_whatsapp');
        const maskOptionsWhatsApp = {
            mask: '000-000-000'
        };
        if (typeof inputWhatsApp !== undefined && inputWhatsApp) {
            // maskWhatsApp = IMask(inputWhatsApp, maskOptionsWhatsApp);
        }

        const inputPrice = document.getElementById('imovel_price');
        const maskOptionsPrice = {
            mask: 'num',
            blocks: {
                num: {
                    mask: Number,
                    scale: 2,
                    thousandsSeparator: '.',
                    padFractionalZeros: true,
                    radix: ',',
                    mapToRadix: ['.'],
                }
            }
        };
        if (typeof inputPrice !== undefined && inputPrice) {
            maskPrice = IMask(inputPrice, maskOptionsPrice);
        }

        const inputPriceSimulador = document.getElementById('imovel_price_simulador');
        const maskOptionsPriceSimulador = {
            mask: '€ num',
            blocks: {
                num: {
                    mask: Number,
                    scale: 2,
                    thousandsSeparator: '.',
                    padFractionalZeros: true,
                    radix: ',',
                    mapToRadix: ['.'],
                }
            }
        };
        if (typeof inputPriceSimulador !== undefined && inputPriceSimulador) {
            maskPriceSimulador = IMask(inputPriceSimulador, maskOptionsPriceSimulador);
        }

        const inputPoupancaSimulador = document.getElementById('poupanca');
        const maskOptionsPoupancaSimulador = {
            mask: '€ num',
            blocks: {
                num: {
                    mask: Number,
                    scale: 2,
                    thousandsSeparator: '.',
                    padFractionalZeros: true,
                    radix: ',',
                    mapToRadix: ['.'],
                }
            }
        };
        if (typeof inputPoupancaSimulador !== undefined && inputPoupancaSimulador) {
            maskPoupancaSimulador = IMask(inputPoupancaSimulador, maskOptionsPoupancaSimulador);
        }
    }

    function miFileImagePreview() {
        const containers = document.querySelectorAll('.mi-file-image-preview');
        containers.forEach(container => {
            const fileInput = container.querySelector('input[type="file"]');
            const imagesPreviewContainer = container.querySelector('.images-preview');
            const btnClearImage = container.querySelector('.btn-clear-image');
            const changedThumbnail = container.querySelector('input[name="changed-thumbnail"]');
            btnClearImage.addEventListener('click', e => {
                e.preventDefault();
                fileInput.value = null;
                while (imagesPreviewContainer.firstChild) {
                    imagesPreviewContainer.removeChild(imagesPreviewContainer.lastChild);
                }
                btnClearImage.style.display = 'none';
                changedThumbnail.value = 'true';
            });
            fileInput.addEventListener('change', e => {
                const newFiles = e.target.files;
                while (imagesPreviewContainer.firstChild) {
                    imagesPreviewContainer.removeChild(imagesPreviewContainer.lastChild);
                }
                for (const newFile of newFiles) {
                    const imagePreview = document.createElement('img');
                    imagePreview.classList.add('image-preview');
                    imagePreview.src = URL.createObjectURL(newFile);
                    imagesPreviewContainer.append(imagePreview);
                }
                btnClearImage.style.display = 'block';
                changedThumbnail.value = 'true';
            });
        });
    }

    function miGaleriaPreview() {
        const galeriaPreviewContainer = document.querySelectorAll('.galeria-preview');
        galeriaPreviewContainer.forEach(container => {
            const fileInput = container.querySelector('input[type="file"]');
            const imgQty = fileInput.getAttribute('data-img-qty');
            const maxImgQty = fileInput.getAttribute('data-max-img-qty');
            const imagesPreviewContainer = container.querySelector('.box-img-upload');
            const fileName = container.querySelector('.file-name');
            let originalFileNameText = fileName.innerText;
            fileName.setAttribute('data-original-text', originalFileNameText);
            const btnClearFileInput = container.querySelector('.btn-clear-file-upload');
            fileInput.addEventListener('change', e => {
                const newFiles = e.target.files;
                const selectedFilesQty = newFiles.length;
                console.log('selectedFilesQty', selectedFilesQty);
                console.log('imgQty', imgQty);
                console.log('maxImgQty', maxImgQty);
                console.log('fileInput', fileInput.value);
                miClearImagesPreview(imagesPreviewContainer);
                if (selectedFilesQty + parseInt(imgQty) > parseInt(maxImgQty)) {
                    console.log('Quantidade máxima de imagens atingida.');
                    fileName.innerText = 'Quantidade máxima de imagens atingida.';
                    fileInput.value = '';
                    return;
                }
                originalFileNameText = fileName.getAttribute('data-original-text') ? fileName.getAttribute('data-original-text') : originalFileNameText;
                fileName.innerText = newFiles.length > 0 ? '' : originalFileNameText;
                let count = 0;
                for (const newFile of newFiles) {
                    const imagePreview = document.createElement('img');
                    imagePreview.classList.add('image-preview');
                    imagePreview.src = URL.createObjectURL(newFile);
                    const imagesPreviewItem = document.createElement('div');
                    imagesPreviewItem.classList.add('item-upload');
                    imagesPreviewItem.append(imagePreview);
                    imagesPreviewItem.append(imagePreview);
                    imagesPreviewContainer.append(imagesPreviewItem);
                    count++;
                }
                fileName.innerText = `${count} arquivos adicionados.`;
            });
            btnClearFileInput.addEventListener('click', e => {
                e.preventDefault();
                fileInput.value = '';
                fileInput.dispatchEvent(new Event('change'));
            });
        });
    }

    // ref @link: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
    function miDragAndDropFiles() {
        const dropArea = document.getElementById('uploadfile');
        if (typeof dropArea === undefined || !dropArea) {
            return;
        }
        const fileInput = dropArea.querySelector('input[type="file"]');
        if (typeof fileInput === undefined || !fileInput) {
            return;
        }
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ;['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropArea.classList.add('highlight');
        }

        function unhighlight(e) {
            dropArea.classList.remove('highlight');
        }

        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            let dt = e.dataTransfer;
            let files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            // ref: @link https://pqina.nl/blog/set-value-to-file-input/
            const dataTransfer = new DataTransfer();
            ([...fileInput.files]).forEach(file => {
                dataTransfer.items.add(file);
            });
            ([...files]).forEach(file => {
                console.log(file);
                dataTransfer.items.add(file);
            });
            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }

    }

    function miDragAndDropToReorderImages() {
        const draggables = document.querySelectorAll('.draggable-item');
        const containers = document.querySelectorAll('.drag-container');
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
            });
        });
        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }
            });
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    function miClearImagesPreview(element) {
        while (element.firstChild) {
            element.removeChild(element.lastChild);
        }
    }

    function miGerenciamentoGaleriaImovel() {
        const containers = document.querySelectorAll('.galeria-imovel-management');
        containers.forEach(container => {
            const items = container.querySelectorAll('.galeria-imovel-item');
            const btns = container.querySelectorAll('.remove-galeria-imovel-item');
            items.forEach((item, i) => {
                btns[i].addEventListener('click', e => {
                    e.preventDefault();
                    console.log('click');
                    item.remove();
                });
            });
        });
    }

    function miCaracteristicaRepeater() {
        const repeaters = document.querySelectorAll('.mi-repeater');
        repeaters.forEach((repeater) => {
            const repeaterGroup = repeater.querySelector('.repeater-group');
            const btnAddGroup = repeater.querySelector('.add-group');
            const selectorListItem = '.repeater-group-list';
            const selectorBtnDeleteItem = '.delete-item';
            // atualiza os índices
            miUpdateRepeaterItemsIndex(repeaterGroup, selectorListItem);
            btnAddGroup.addEventListener('click', e => {
                e.preventDefault();
                // adiciona novo item
                miAddNewRepeaterItem(repeaterGroup, selectorListItem, selectorBtnDeleteItem);
                // atualiza novamente os índices
                miUpdateRepeaterItemsIndex(repeaterGroup, selectorListItem);
            });
            const listItems = repeaterGroup.querySelectorAll(selectorListItem);
            listItems.forEach(item => {
                miDeleteRepeateritemEvent(item, selectorBtnDeleteItem, repeaterGroup, selectorListItem);
            });
        });
    }

    function miDeleteRepeateritemEvent(item, selectorDeleteBtn, parentWrapper, selectorItem) {
        const deleteBtn = item.querySelector(selectorDeleteBtn);
        deleteBtn.addEventListener('click', e => {
            e.preventDefault();
            item.remove();
            const items = parentWrapper.querySelectorAll(selectorItem);
            if (items.length === 0) {
                miAddNewRepeaterItem(parentWrapper, selectorItem, selectorDeleteBtn);
            }
            console.log('selectorItem', items.length);

            // atualiza novamente os índices
            miUpdateRepeaterItemsIndex(parentWrapper, selectorItem);
        });
    }


    function miAddNewRepeaterItem(parentWrapper, selectorItem, selectorDeleteBtn) {
        const listItems = parentWrapper.querySelectorAll(selectorItem);
        const newItem = miCaracteristicaRepeaterGroupTemplate(listItems.length + 1);
        parentWrapper.append(newItem);
        miDeleteRepeateritemEvent(newItem, selectorDeleteBtn, parentWrapper, selectorItem);
    }

    function miUpdateRepeaterItemsIndex(parentWrapper, selector) {
        const items = parentWrapper.querySelectorAll(selector);
        // remove os índices anteriores
        items.forEach((item) => {
            item.removeAttribute('data-index');
        });
        // adiciona os novos índices
        items.forEach((item, n) => {
            const newIndex = n + 1;
            item.setAttribute('data-index', newIndex);
            const label = item.querySelector('label');
            if (typeof label !== undefined && label) {
                label.innerText = newIndex;
            }
        });
    }

    function miCaracteristicaRepeaterGroupTemplate(index) {
        const spanNumber = document.createElement('span');
        spanNumber.classList.add('caracteristica-number');
        spanNumber.innerText = index;

        const label = document.createElement('label');
        label.setAttribute('for', 'característica-' + index);
        label.append(spanNumber);

        const inputCaracteristica = document.createElement('input');
        inputCaracteristica.id = 'característica-' + index;
        inputCaracteristica.type = 'text';
        inputCaracteristica.name = 'caracteristicas-especificas[]';
        inputCaracteristica.classList.add('form-control');
        inputCaracteristica.classList.add('style-1');

        const iconLink = document.createElement('a');
        iconLink.href = '#';
        iconLink.classList.add('delete-item');
        iconLink.classList.add('icon-link');
        iconLink.innerHTML = '<span class="icon icon-trash"></span>';

        const inputIconGroup = document.createElement('div');
        inputIconGroup.classList.add('input-icon-group');
        inputIconGroup.append(inputCaracteristica);
        inputIconGroup.append(iconLink);

        const boxFieldset = document.createElement('fieldset');
        boxFieldset.classList.add('box');
        boxFieldset.classList.add('box-fieldset');
        boxFieldset.append(label);
        boxFieldset.append(inputIconGroup);

        const repeaterGroup = document.createElement('div');
        repeaterGroup.classList.add('caracteristica-group');
        repeaterGroup.classList.add('repeater-group-list');
        repeaterGroup.append(boxFieldset);

        return repeaterGroup;
    }

    function homeDestaquesSwiper() {

        const swiper = new Swiper('.home-destaque-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                },
                1200: {
                    slidesPerView: 4,
                },
            },
        });
    }

    function miShowAlert(alertPlaceholder, message, type) {
        console.log(message);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div id="contact-form-alert" class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        alertPlaceholder.append(wrapper);
    }

    function miContactForm() {
        const contactForms = document.querySelectorAll('.mi-contact-form');
        contactForms.forEach(contactForm => {
            contactForm.addEventListener('submit', e => {
                e.preventDefault();

                if (typeof document.getElementById('contact-form-alert') !== undefined && document.getElementById('contact-form-alert')) {
                    const contactFormAlert = bootstrap.Alert.getOrCreateInstance('#contact-form-alert');
                    contactFormAlert.close();
                }

                if (!contactForm.checkValidity()) {
                    return;
                }
                contactForm.classList.add('was-validated');

                const nomeInput = contactForm.querySelector('#nome');
                const emailInput = contactForm.querySelector('#email');
                const mensagemTextarea = contactForm.querySelector('#mensagem');
                const btn = contactForm.querySelector('button');

                if (typeof btn === undefined || !btn) {
                    return;
                }

                if (btn.disabled) {
                    return;
                }
                btn.disabled = true;
                const originalBtntext = btn.innerText;
                btn.innerText = 'Enviando...';

                const ajaxUrl = ajax_object.ajax_url;
                const data = new FormData(contactForm);
                const action = data.get('action');

                // console.log(data.get('action'));

                // for (const [key, value] of data) {
                //     console.log('data', `${key}: ${value}\n`);
                // }

                const alertPlaceholder = document.getElementById('contact-form-alert-placeholder');

                fetch(ajaxUrl, {
                    method: 'POST',
                    body: data
                })
                    .then((response) => response.json())
                    .then((response) => {
                        console.log('response', response);
                        if (response.success) {
                            miShowAlert(alertPlaceholder, response.data.msg, 'success');
                            nomeInput.value = '';
                            emailInput.value = '';
                            mensagemTextarea.value = '';
                        } else {
                            miShowAlert(alertPlaceholder, response.data.msg, 'danger');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        miShowAlert(alertPlaceholder, error, 'danger');
                    })
                    .finally(() => {
                        btn.disabled = false;
                        btn.innerText = originalBtntext;
                        contactForm.classList.remove('was-validated');
                    });

            });
        });
    }

    function miUnselectRAdioInput() {
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(radioInput => {
            radioInput.addEventListener('click', () => {
                if (radioInput.dataset.checked === 'true') {
                    radioInput.checked = false;
                    radioInput.dataset.checked = 'false';
                } else {
                    radioInputs.forEach(otherRadio => {
                        if (otherRadio.name === radioInput.name) {
                            otherRadio.checked = false;
                            otherRadio.dataset.checked = 'false';
                        }
                    });
                    radioInput.checked = true;
                    radioInput.dataset.checked = 'true';
                }
            });
        });
    }

    function miToggleFavoriteForm() {
        const toggleFavoriteForms = document.querySelectorAll('.mi-toggle-favorite');
        toggleFavoriteForms.forEach(toggleFavoriteForm => {
            toggleFavoriteForm.addEventListener('submit', e => {
                e.preventDefault();

                if (typeof document.getElementById('contact-form-alert') !== undefined && document.getElementById('contact-form-alert')) {
                    const contactFormAlert = bootstrap.Alert.getOrCreateInstance('#contact-form-alert');
                    contactFormAlert.close();
                }

                const btn = toggleFavoriteForm.querySelector('button');

                if (typeof btn === undefined || !btn) {
                    return;
                }

                if (btn.disabled) {
                    return;
                }
                btn.disabled = true;

                const ajaxUrl = ajax_object.ajax_url;
                const data = new FormData(toggleFavoriteForm);
                const action = data.get('action');

                console.log(data.get('action'));

                // for (const [key, value] of data) {
                //     console.log('data', `${key}: ${value}\n`);
                // }

                fetch(ajaxUrl, {
                    method: 'POST',
                    body: data
                })
                    .then((response) => response.json())
                    .then((response) => {
                        console.log('response', response);
                        if (response.success) {
                            if (response.data.status === 'added') {
                                btn.classList.add('favorited');
                            } else {
                                btn.classList.remove('favorited');
                            }
                            console.log(response.data.msg);
                        } else {
                            miCustomModal('mi-modal-favorite', 'Atenção!', response.data.msg);
                            console.log(response.data.msg);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                        btn.disabled = false;
                    });

            });
        });
    }

    function miCustomModal(modalId, title, message) {

        let modalContainer = document.getElementById(modalId);
        if (typeof modalContainer === undefined || !modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = modalId;
            modalContainer.classList.add('modal');
            modalContainer.classList.add('fade');
            modalContainer.setAttribute('aria-hidden', true);

            const modalDialog = document.createElement('div');
            modalDialog.classList.add('modal-dialog');
            modalContainer.append(modalDialog);

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            modalDialog.append(modalContent);

            const modalHeader = document.createElement('div');
            modalHeader.classList.add('modal-header');
            modalContent.append(modalHeader);

            const modalTitle = document.createElement('h5');
            modalTitle.classList.add('modal-title');
            modalTitle.innerText = title;
            modalHeader.append(modalTitle);

            const modalCloseBtn = document.createElement('button');
            modalCloseBtn.classList.add('btn-close');
            modalCloseBtn.type = 'button';
            modalCloseBtn.setAttribute('data-bs-dismiss', 'modal');
            modalCloseBtn.setAttribute('aria-label', 'Close');
            modalHeader.append(modalCloseBtn);

            const modalBody = document.createElement('div');
            modalBody.classList.add('modal-body');
            modalBody.innerHTML = `<p>${message}</p>`;
            modalContent.append(modalBody);

            // const modalFooter = document.createElement('div');
            // modalFooter.classList.add('modal-footer');
            // modalContent.append(modalFooter);

            const body = document.querySelector('body');
            body.prepend(modalContainer);
        }

        const options = {
            backdrop: true,
            focus: true,
            keyboard: true
        };
        const newModal = new bootstrap.Modal(modalContainer, options);
        newModal.show();
        modalContainer.addEventListener('hidden.bs.modal', e => {
            newModal.dispose();
            modalContainer.remove();
        });
    }

    function miGetPreviousElementByClass(element, className) {
        let previous = element.previousElementSibling;
        while (previous) {
            if (previous.classList.contains(className)) {
                return previous;
            }
            previous = previous.previousElementSibling;
        }
        return null;
    }

    function miGetPreviousElementById(element, previousElementId) {
        let previous = element.previousElementSibling;
        while (previous) {
            if (previous.id === previousElementId) {
                return previous;
            }
            previous = previous.previousElementSibling;
        }
        return null;
    }

    function miRangeInput() {
        const rangeInputs = document.querySelectorAll('.range-input');
        rangeInputs.forEach(rangeInput => {
            const inputToGetValueId = rangeInput.getAttribute('data-label');
            const inputToGetValue = miGetPreviousElementById(rangeInput, inputToGetValueId);
            if (typeof inputToGetValue !== undefined && inputToGetValue) {
                console.log('forEach');

                rangeInput.addEventListener('input', e => {
                    console.log('addEventListener');
                    inputToGetValue.value = e.target.value;
                    inputToGetValue.dispatchEvent(new KeyboardEvent('blur'));
                });
            } else {
                console.warn('Não foi possível encontrar o elemento com o ID: ', inputToGetValueId);
            }
        });
    }

    function miUpdateInputNumberOnKeyUp() {
        const inputFields = document.querySelectorAll('.input-number-group-field');
        inputFields.forEach(inputField => {
            const minVal = inputField.getAttribute('data-min');
            const maxVal = inputField.getAttribute('data-max');
            let fixedMinVal = parseFloat(minVal);
            let fixedMaxVal = parseFloat(maxVal);
            fixedMinVal = Math.round(fixedMinVal * 100) / 100;
            fixedMaxVal = Math.round(fixedMaxVal * 100) / 100;
            inputField.addEventListener('keyup', e => {
                const currVal = inputField.value;
                if (isNaN(currVal)) {
                    inputField.value = fixedMinVal.toFixed(2);
                } else {
                    let fixedCurrVal = parseFloat(currVal);
                    fixedCurrVal = Math.round(currVal * 100) / 100;
                    if (fixedCurrVal > fixedMaxVal) {
                        inputField.value = fixedMaxVal.toFixed(2);
                    } else if (fixedCurrVal < fixedMinVal) {
                        inputField.value = fixedMinVal.toFixed(2);
                    }
                }
            });
        });
    }

    function miInputNumberGroup() {
        const inputNumberGroups = document.querySelectorAll('.input-number-group');
        inputNumberGroups.forEach(group => {
            const btns = group.querySelectorAll('.input-number-group-btn');
            const inputField = group.querySelector('.input-number-group-field');
            const minVal = inputField.getAttribute('data-min');
            const maxVal = inputField.getAttribute('data-max');
            btns.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    const action = btn.getAttribute('data-btn-type');
                    inputField.value = miInputNumberGroupChangeValue(inputField, action, minVal, maxVal);
                });
            });
        });
    }

    function miInputNumberGroupChangeValue(inputField, action, minVal, maxVal) {
        // Converte para float para ter certeza que é um número
        const currVal = parseFloat(inputField.value);
        // Aplica estratégia de escalonamento para prevenir resultados imprecisos do JS
        let fixedCurrVal = Math.round(currVal * 100) / 100;
        // Converte para float para ter certeza que é um número
        let fixedMinVal = parseFloat(minVal);
        let fixedMaxVal = parseFloat(maxVal);
        // Aplica estratégia de escalonamento para prevenir resultados imprecisos do JS
        fixedMinVal = Math.round(fixedMinVal * 100) / 100;
        fixedMaxVal = Math.round(fixedMaxVal * 100) / 100;
        let newValue = fixedCurrVal;
        // Verifica se o número passado já não é maior que o limite máximo 
        // antes de tentar fazer o cálculo
        if (fixedCurrVal > fixedMaxVal) {
            newValue = fixedMaxVal;
            // Verifica se o número passado é menor que o limite máximo 
            // para então poder fazer o cálculo
        } else if (action === '+' && fixedCurrVal < fixedMaxVal) {
            newValue = fixedCurrVal + 0.01;
            // Verifica se o número passado é maior que o limite mínimo 
            // para então poder fazer o cálculo
        } else if (action === '-' && fixedCurrVal > fixedMinVal) {
            newValue = fixedCurrVal - 0.01;
        }
        // Aplica estratégia de escalonamento para prevenir resultados imprecisos do JS
        const fixedNewValue = Math.round(newValue * 100) / 100;
        return fixedNewValue.toFixed(2);
    }

    function miTootltips() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'click'
        }));
        tooltipTriggerList.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
            });
        });
    }

    window.addEventListener('load', function () {
        miFormsValidation();
        miNewsletterForm();
        miArchiveLayout();
        miArchiveSort();
        miSelectList();
        miOperacaoFilter();
        tooglePreviewContent();
        miAnuncianteContactForm();
        miGoBackBtn();
        miPasswordStrength();
        miMyImoveisSort();
        inputMasks();
        miFileImagePreview();
        miCaracteristicaRepeater();
        miGaleriaPreview();
        miGerenciamentoGaleriaImovel();
        miDragAndDropFiles();
        homeDestaquesSwiper();
        miContactForm();
        miUnselectRAdioInput();
        miToggleFavoriteForm();
        miRangeInput();
        miInputNumberGroup();
        miUpdateInputNumberOnKeyUp();
        miTootltips();
    });

})();

function initMap() {
    const mapDiv = document.getElementById('map');
    if (typeof (mapDiv) === undefined || !mapDiv) {
        return;
    }

    if ((typeof (lat) === undefined || !lat) || (typeof (lng) === undefined || !lng)) {
        return;
    }

    lat = Number(lat);
    lng = Number(lng);
    const defaultLocation = { lat, lng };
    map = new google.maps.Map(mapDiv, {
        zoom: 15,
        center: defaultLocation,
        mapTypeControl: false,
    });

    // const defaultLocationMarker = new google.maps.Marker({
    //     position: defaultLocation,
    //     map,
    //     title: "Sua localização",
    // });

    todosImoveis.forEach((imovel, i) => {
        const LatLng = { lat: parseFloat(imovel.lat), lng: parseFloat(imovel.lng) };
        const itemLocation = LatLng;
        const itemLocationContentString =
            `<div class="map-listing-item">
                <div class="inner-box">
                    <h5><a href="${imovel.post_url}">${imovel.title}</a></h5>
                    <address>
                    Endereço: ${imovel.rua}, ${imovel.numero} - ${imovel.cidade} / ${imovel.estado}, ${imovel.codigo_postal}
                    </address>
                </div>
            </div>`;
        const itemLocationInfowindow = new google.maps.InfoWindow({
            content: itemLocationContentString,
            ariaLabel: imovel.title,
        });
        allInfoWindows.push(itemLocationInfowindow);
        const itemLocationMarker = new google.maps.Marker({
            position: itemLocation,
            map,
            title: imovel.title,
        });
        // itemLocationMarker.addListener("click", () => {
        //     itemLocationInfowindow.open({
        //         anchor: itemLocationMarker,
        //         map,
        //     });
        // });
        // ref @link: https://jsfiddle.net/upsidown/8gjt0y6p/
        google.maps.event.addListener(itemLocationMarker, 'click', (function (itemLocationMarker, i) {

            return function () {
                closeAllInfoWindows();
                itemLocationInfowindow.setContent(itemLocationContentString);
                itemLocationInfowindow.open(map, itemLocationMarker);
                map.setZoom(16);
                map.setCenter(itemLocationMarker.getPosition());
            };

        })(itemLocationMarker, i));
        // markers.push(itemLocationMarker);
        markers[imovel.post_id] = itemLocationMarker;
    });

}

function closeAllInfoWindows() {
    for (const item of allInfoWindows) {
        item.close();
    }
}

function miInitAutocomplete() {

    const autocompleteWrappers = document.querySelectorAll('.autocomplete-wrapper');
    // if (typeof autocompleteInput === undefined || !autocompleteInput) {
    //     return;
    // }
    autocompleteWrappers.forEach(autocompleteWrapper => {
        const autocompleteInput = autocompleteWrapper.querySelector('.autocomplete');
        if (typeof autocompleteInput !== undefined && autocompleteInput) {
            autocomplete = new google.maps.places.Autocomplete(
                autocompleteInput,
                {
                    componentRestrictions: { 'country': ['PT'] },
                    fields: ['place_id', 'geometry', 'name', 'address_components']
                }
            );
            const autocompleteMessage = autocompleteWrapper.querySelector('.autocomplete-message');
            autocompleteInput.addEventListener('change', e => {
            });

            autocomplete.addListener('place_changed', () => miOnPlaceChanged(autocompleteMessage));
        }
    });
}

function miSetInputsNewValue(inputs, newValue) {
    inputs.forEach(input => {
        input.value = newValue;
    });
}

function miOnPlaceChanged(autocompleteMessage) {

    let place = autocomplete.getPlace();

    const miAutocompleteForm = autocompleteMessage.closest('form');
    const autocompleteInput = miAutocompleteForm.querySelector('input.autocomplete');
    const validateCompleteAdress = autocompleteInput.getAttribute('data-validate') === 'true';

    if (typeof miAutocompleteForm === undefined || !miAutocompleteForm) {
        console.error('Não foi possível encontrar o formulário do autocomplete');
        return;
    }

    const latInput = miAutocompleteForm.querySelectorAll('input[name="lat"]');
    const lngInput = miAutocompleteForm.querySelectorAll('input[name="lng"]');
    const stateInput = miAutocompleteForm.querySelectorAll('input[name="imovel_estado"]');
    const cidadeInput = miAutocompleteForm.querySelectorAll('input[name="imovel_cidade"]');
    const cepInput = miAutocompleteForm.querySelectorAll('input[name="imovel_codigo_postal"]');
    const imovelRua = miAutocompleteForm.querySelectorAll('input[name="imovel_rua"]');
    const autocompleteFormBtn = document.getElementById('new-imovel-form-btn');
    let regiaoTerms = '';


    if (typeof autocompleteFormBtn !== undefined && autocompleteFormBtn) {
        autocompleteFormBtn.disabled = true;
    }

    if (typeof autocompleteMessage !== undefined && autocompleteMessage) {
        autocompleteMessage.style.display = 'block';
    }

    if (typeof latInput === undefined || !latInput) {
        console.error('Não foi possível encontrar o input de latitude');
        return;
    }

    if (typeof lngInput === undefined || !lngInput) {
        console.error('Não foi possível encontrar o input de longitude');
        return;
    }

    if (!place.geometry) {
        document.getElementById('autocomplete').placeholder = 'Digite um endereço';
        miSetInputsNewValue(latInput, '');
        miSetInputsNewValue(lngInput, '');
        miSetInputsNewValue(stateInput, '');
        miSetInputsNewValue(cidadeInput, '');
        miSetInputsNewValue(cepInput, '');
        miSetInputsNewValue(imovelRua, '');
        autocompleteMessage.style.display = 'block';
        if (typeof autocompleteFormBtn !== undefined && autocompleteFormBtn) {
            autocompleteFormBtn.disabled = true;
        }
        const regiaoTable = document.getElementById('table-regiao-imoveis');
        if (typeof regiaoTable !== undefined && regiaoTable) {
            const searchInput = regiaoTable.querySelector('[type="search"');
            if (typeof searchInput !== undefined && searchInput) {
                regiaoTerms = document.querySelectorAll('[name="regiao-terms[]"]');
                regiaoTerms.forEach(item => {
                    item.checked = false;
                    item.dispatchEvent(new Event('change'));
                });
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('keyup'));
            }
        }
    } else {
        console.log(place.address_components);
        autocompleteMessage.style.display = 'none';
        if (typeof autocompleteFormBtn !== undefined && autocompleteFormBtn) {
            autocompleteFormBtn.disabled = false;
        }
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        const estado = place.address_components.filter(item => item.types.includes('administrative_area_level_1'));
        const cidade = place.address_components.filter(item => item.types.includes('administrative_area_level_2'));
        const cep = place.address_components.filter(item => item.types.includes('postal_code'));
        const rua = place.address_components.filter(item => item.types.includes('route'));
        const numero = place.address_components.filter(item => item.types.includes('street_number'));
        document.getElementById('autocomplete').innerHTML = place.name;
        miSetInputsNewValue(latInput, lat);
        miSetInputsNewValue(lngInput, lng);
        if (estado[0]?.short_name) {
            const newStateValue = estado[0]?.short_name ? estado[0]?.short_name : '';
            miSetInputsNewValue(stateInput, newStateValue);
        } else if (validateCompleteAdress) {
            autocompleteMessage.style.display = 'block';
            miSetInputsNewValue(stateInput, '');
            if (typeof autocompleteFormBtn !== undefined && autocompleteFormBtn) {
                autocompleteFormBtn.disabled = true;
            }
        }
        if (cidade[0]?.short_name) {
            const newCidadeValue = cidade[0]?.short_name ? cidade[0]?.short_name : '';
            miSetInputsNewValue(cidadeInput, newCidadeValue);
        } else if (validateCompleteAdress) {
            autocompleteMessage.style.display = 'block';
            miSetInputsNewValue(cidadeInput, '');
            if (typeof autocompleteFormBtn !== undefined && autocompleteFormBtn) {
                autocompleteFormBtn.disabled = true;
            }
        }
        if (cep[0]?.short_name) {
            const newCepValue = cep[0]?.short_name ? cep[0]?.short_name : '';
            miSetInputsNewValue(cepInput, newCepValue);
        } else if (validateCompleteAdress) {
            autocompleteMessage.style.display = 'block';
            miSetInputsNewValue(cepInput, '');
            if (typeof autocompleteFormBtn !== undefined && autocompleteFormBtn) {
                autocompleteFormBtn.disabled = true;
            }
        }
        if (rua[0]?.long_name) {
            const newRuaValue = rua[0]?.long_name ? rua[0]?.long_name : '';
            miSetInputsNewValue(imovelRua, newRuaValue);
        } else if (validateCompleteAdress) {
            autocompleteMessage.style.display = 'block';
            miSetInputsNewValue(imovelRua, '');
            if (typeof autocompleteFormBtn !== undefined && autocompleteFormBtn) {
                autocompleteFormBtn.disabled = true;
            }
        }

        const regiaoTable = document.getElementById('table-regiao-imoveis');
        if (typeof regiaoTable !== undefined && regiaoTable) {
            const searchInput = regiaoTable.querySelector('[type="search"');
            if (typeof searchInput !== undefined && searchInput) {
                searchInput.value = estado[0]?.short_name;
                searchInput.dispatchEvent(new Event('keyup'));

                const normalizeEstado = miNormalizeText(estado[0]?.short_name);

                regiaoTerms = document.querySelectorAll('[name="regiao-terms[]"]');
                regiaoTerms.forEach(item => {
                    const normalizeitemName = miNormalizeText(item.getAttribute('data-name'));
                    if (normalizeEstado === normalizeitemName) {
                        item.checked = true;
                        item.dispatchEvent(new Event('change'));
                    }
                });
            }
        }
    }
}

function initGoogleApi() {
    window.addEventListener('load', function () {
        // initMap();
        miInitAutocomplete();
    });
}