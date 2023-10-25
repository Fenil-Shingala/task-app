import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListModalComponent } from './list-modal.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedServiceService } from 'src/app/services/shared-service/shared-service.service';
import { ListServiceService } from 'src/app/services/api-service/list-service/list-service.service';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { of } from 'rxjs';

describe('AddListModalComponent', () => {
  let component: ListModalComponent;
  let fixture: ComponentFixture<ListModalComponent>;
  let mockListService: jasmine.SpyObj<ListServiceService>;
  let sharedService: jasmine.SpyObj<SharedServiceService>;
  let modalService: jasmine.SpyObj<NzModalService>;
  let messageService: jasmine.SpyObj<NzMessageService>;
  const mockLists = [
    { id: 1, listTitle: 'titile 1', cards: [] },
    { id: 2, listTitle: 'titile 2', cards: [] },
  ];

  beforeEach(() => {
    const listServiceSpy = jasmine.createSpyObj('ListServiceService', [
      'getList',
      'updateList',
      'addList',
    ]);
    listServiceSpy.getList.and.returnValue(of([]));
    const sharedServiceSpy = jasmine.createSpyObj(SharedServiceService, [
      'showErrorOnSubmit',
    ]);
    const modalServiceSpy = jasmine.createSpyObj(NzModalService, ['closeAll']);
    const messageServiceSpy = jasmine.createSpyObj(NzMessageService, [
      'success',
    ]);
    TestBed.configureTestingModule({
      declarations: [ListModalComponent],
      imports: [FormsModule, ReactiveFormsModule, NzFormModule],
      providers: [
        { provide: ListServiceService, useValue: listServiceSpy },
        { provide: SharedServiceService, useValue: sharedServiceSpy },
        { provide: NzModalService, useValue: modalServiceSpy },
        { provide: NzMessageService, useValue: messageServiceSpy },
        { provide: NZ_MODAL_DATA, useValue: mockLists[0] },
      ],
    });
    fixture = TestBed.createComponent(ListModalComponent);
    component = fixture.componentInstance;
    mockListService = TestBed.inject(
      ListServiceService
    ) as jasmine.SpyObj<ListServiceService>;
    sharedService = TestBed.inject(
      SharedServiceService
    ) as jasmine.SpyObj<SharedServiceService>;
    modalService = TestBed.inject(
      NzModalService
    ) as jasmine.SpyObj<NzModalService>;
    messageService = TestBed.inject(
      NzMessageService
    ) as jasmine.SpyObj<NzMessageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should patch value in listTitle input if open edit dialog', () => {
      const listTitleControl = component.listForm.get('listTitle');
      component.ngOnInit();
      expect(listTitleControl).toBeTruthy();
      expect(listTitleControl?.value).toEqual(
        mockLists[0].listTitle.toUpperCase().trim()
      );
    });
  });

  it('should populate form with existing data when editListData is provided', () => {
    // const listData = { id: 1, listTitle: 'Existing List', cards: [] };
    mockListService.getList.and.returnValue(of(mockLists));
    // component.editListData = listData;
    component.ngOnInit();
    // fixture.detectChanges();
    expect(component.allLists.length).toBe(mockLists.length);
  });

  it('should fetch lists and assign to allLists property', () => {
    // spyOn(mockListService, 'getList');
    mockListService.getList.and.returnValue(of(mockLists));
    component.getAllLists();
    expect(component.allLists).toEqual(mockLists);
    expect(component.allLists.length).toBe(mockLists.length);
  });

  // it('should focus on input element after view initialization', () => {
  //   spyOn(component.listInput.nativeElement, 'focus');
  //   component.ngAfterViewInit();
  //   expect(component.listInput.nativeElement.focus).toHaveBeenCalled();
  // });
});
