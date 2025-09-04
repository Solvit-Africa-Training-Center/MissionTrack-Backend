import { Request, Response } from 'express';

// Mock all dependencies BEFORE importing
jest.mock('../database/models/mission', () => ({
    Mission: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn()
    }
}));

jest.mock('../database/models', () => ({
    Budget: {
        create: jest.fn(),
        findOne: jest.fn(),
        belongsTo: jest.fn(),
        update: jest.fn()
    },
    MissDoc: {
        create: jest.fn(),
        destroy: jest.fn(),
        belongsTo: jest.fn()
    }
}));

jest.mock('../services/mission');
jest.mock('../utils/response');

// Import after mocking
import { MissionController } from '../controllers/missionController';
import { MissionService } from '../services/mission';
import { ResponseService } from '../utils/response';
import { Mission } from '../database/models/mission';

describe('MissionController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockResponseService: jest.MockedFunction<typeof ResponseService>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            body: {},
            params: {},
            files: []
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;

        // Mock ResponseService to return a simple response
        mockResponseService = ResponseService as jest.MockedFunction<typeof ResponseService>;
        mockResponseService.mockImplementation(({ res, status }) => {
            res.status!(status);
            return res;
        });
    });


    // Test create the Mission
    describe('createMission', () => {
        it('should create mission successfully', async () => {
            const missionData = {
                title: 'Test Mission',
                description: 'Test Description',
                location: 'Test Location',
                jobPosition: 'Test Position',
                status: 'pending',
                estimatedTransportCost: '100',
                estimatedAccommodationCost: '200',
                estimatedMealCost: '50',
                totalAmount: '350'
            };

            const mockFiles = [
                {
                    originalname: 'test.pdf',
                    filename: 'test123.pdf'
                }
            ];

            mockRequest.body = missionData;

            const mockMission = { id: '1', ...missionData };
            (Mission.findOne as jest.Mock).mockResolvedValue(null);

            // Mock the service method
            const mockCreateMission = jest.fn().mockResolvedValue(mockMission);
            (MissionService as jest.Mock).mockImplementation(() => ({
                createMission: mockCreateMission
            }));

            await MissionController.createMission(mockRequest as Request, mockResponse as Response);

            expect(Mission.findOne).toHaveBeenCalledWith({
                where: { location: missionData.location }
            });
            expect(mockCreateMission).toHaveBeenCalledWith({
                title: missionData.title,
                description: missionData.description,
                location: missionData.location,
                jobPosition: missionData.jobPosition,
                status: missionData.status,
                budget: {
                    estimatedTransportCost: 100,
                    estimatedAccommodationCost: 200,
                    estimatedMealCost: 50,
                    totalAmount: 350
                },
                documents: [{
                    documentName: 'test.pdf',
                    documentUrl: 'http://localhost:5000/uploads/test123.pdf'
                }]
            });
            expect(ResponseService).toHaveBeenCalledWith({
                message: "Mission created successfully",
                data: mockMission,
                success: true,
                status: 200,
                res: mockResponse
            });
        });

        it('should return error if mission already exists in location', async () => {
            const missionData = {
                title: 'Test Mission',
                location: 'Test Location',
                description: 'Test Description',
                jobPosition: 'Test Position',
                status: 'pending',
                estimatedTransportCost: '100',
                estimatedAccommodationCost: '200',
                estimatedMealCost: '50',
                totalAmount: '350'
            };

            mockRequest.body = missionData;
            const existingMission = { id: '1', location: 'Test Location' };
            (Mission.findOne as jest.Mock).mockResolvedValue(existingMission);

            await MissionController.createMission(mockRequest as Request, mockResponse as Response);

            expect(ResponseService).toHaveBeenCalledWith({
                message: "You have arleady mission in that location",
                res: mockResponse,
                status: 400,
                data: existingMission,
                success: false
            });
        });

        it('should handle mission creation without files', async () => {
            const missionData = {
                title: 'Test Mission',
                description: 'Test Description',
                location: 'Test Location',
                jobPosition: 'Test Position',
                status: 'pending',
                estimatedTransportCost: '100',
                estimatedAccommodationCost: '200',
                estimatedMealCost: '50',
                totalAmount: '350'
            };

            mockRequest.body = missionData;
            mockRequest.files = undefined;

            const mockMission = { id: '1', ...missionData };
            (Mission.findOne as jest.Mock).mockResolvedValue(null);

            const mockCreateMission = jest.fn().mockResolvedValue(mockMission);
            (MissionService as jest.Mock).mockImplementation(() => ({
                createMission: mockCreateMission
            }));

            await MissionController.createMission(mockRequest as Request, mockResponse as Response);

            expect(mockCreateMission).toHaveBeenCalledWith({
                title: missionData.title,
                description: missionData.description,
                location: missionData.location,
                jobPosition: missionData.jobPosition,
                status: missionData.status,
                budget: {
                    estimatedTransportCost: 100,
                    estimatedAccommodationCost: 200,
                    estimatedMealCost: 50,
                    totalAmount: 350
                },
                documents: []
            });
        });

        it('should handle errors during mission creation', async () => {
            mockRequest.body = {
                title: 'Test Mission',
                location: 'Test Location'
            };

            const error = new Error('Database error');
            error.stack = 'Error stack trace';
            (Mission.findOne as jest.Mock).mockRejectedValue(error);

            await MissionController.createMission(mockRequest as Request, mockResponse as Response);

            expect(ResponseService).toHaveBeenCalledWith({
                data: error.stack,
                status: 500,
                success: false,
                message: error.message,
                res: mockResponse
            });
        });
    });

    // Test get all Missions
    describe('getAllMissions', () => {
        it('should get all missions successfully', async () => {
            const missions = [
                { id: '1', title: 'Mission 1' },
                { id: '2', title: 'Mission 2' }
            ];

            const mockGetAllMissions = jest.fn().mockResolvedValue(missions);
            (MissionService as jest.Mock).mockImplementation(() => ({
                getAllMissions: mockGetAllMissions
            }));

            await MissionController.getAllMissions(mockRequest as Request, mockResponse as Response);

            expect(mockGetAllMissions).toHaveBeenCalled();
            expect(ResponseService).toHaveBeenCalledWith({
                res: mockResponse,
                data: missions,
                success: true,
                message: "All missions retrieved",
                status: 200
            });
        });

        it('should handle errors when getting all missions', async () => {
            const error = new Error('Database error');
            error.stack = 'Error stack trace';

            const mockGetAllMissions = jest.fn().mockRejectedValue(error);
            (MissionService as jest.Mock).mockImplementation(() => ({
                getAllMissions: mockGetAllMissions
            }));

            await MissionController.getAllMissions(mockRequest as Request, mockResponse as Response);

            expect(ResponseService).toHaveBeenCalledWith({
                data: error.stack,
                status: 500,
                success: false,
                message: error.message,
                res: mockResponse
            });
        });
    });

    // Test get single Mission by ID
    describe('getSingleMissionById', () => {
        it('should get mission by id successfully', async () => {
            const missionId = '1';
            const mission = { id: missionId, title: 'Test Mission' };

            mockRequest.params = { id: missionId };
            (Mission.findByPk as jest.Mock).mockResolvedValue(mission);

            const mockGetMissionById = jest.fn().mockResolvedValue(mission);
            (MissionService as jest.Mock).mockImplementation(() => ({
                getMissionById: mockGetMissionById
            }));

            await MissionController.getSingleMissionById(mockRequest as Request, mockResponse as Response);

            expect(Mission.findByPk).toHaveBeenCalledWith(missionId);
            expect(mockGetMissionById).toHaveBeenCalledWith(missionId);
            expect(ResponseService).toHaveBeenCalledWith({
                res: mockResponse,
                data: mission,
                success: true,
                status: 200,
                message: "Successfull mission fetched"
            });
        });

        it('should return error when mission not found', async () => {
            const missionId = '999';
            mockRequest.params = { id: missionId };
            (Mission.findByPk as jest.Mock).mockResolvedValue(null);

            await MissionController.getSingleMissionById(mockRequest as Request, mockResponse as Response);

            expect(Mission.findByPk).toHaveBeenCalledWith(missionId);
            expect(ResponseService).toHaveBeenCalledWith({
                data: null,
                res: mockResponse,
                message: "Mission not found",
                success: false,
                status: 400
            });
        });
    });

    // Test update Mission
    describe('updateMission', () => {
        it('should update mission successfully', async () => {
            const missionId = '1';
            const updateData = { title: 'Updated Mission' };
            const mission = { id: missionId, title: 'Original Mission' };
            const updatedMission = { id: missionId, title: 'Updated Mission' };

            mockRequest.params = { id: missionId };
            mockRequest.body = updateData;
            (Mission.findByPk as jest.Mock).mockResolvedValue(mission);

            const mockUpdateMission = jest.fn().mockResolvedValue(updatedMission);
            (MissionService as jest.Mock).mockImplementation(() => ({
                updateMission: mockUpdateMission
            }));

            await MissionController.updateMission(mockRequest as Request, mockResponse as Response);

            expect(Mission.findByPk).toHaveBeenCalledWith(missionId);
            expect(mockUpdateMission).toHaveBeenCalledWith(missionId, updateData);
            expect(ResponseService).toHaveBeenCalledWith({
                res: mockResponse,
                data: updatedMission,
                status: 200,
                message: "Update successfull",
                success: true
            });
        });

        it('should return error when mission not found for update', async () => {
            const missionId = '999';
            const updateData = { title: 'Updated Mission' };

            mockRequest.params = { id: missionId };
            mockRequest.body = updateData;
            (Mission.findByPk as jest.Mock).mockResolvedValue(null);

            await MissionController.updateMission(mockRequest as Request, mockResponse as Response);

            expect(ResponseService).toHaveBeenCalledWith({
                res: mockResponse,
                data: null,
                message: "Mission not Found",
                success: false,
                status: 400
            });
        });
    });

    // Test for delete Mission
    describe('deleteMission', () => {
        it('should delete mission successfully', async () => {
            const missionId = '1';
            const mission = { id: missionId, title: 'Test Mission' };

            mockRequest.params = { id: missionId };
            (Mission.findByPk as jest.Mock).mockResolvedValue(mission);

            const mockDeleteMission = jest.fn().mockImplementation();
            (MissionService as jest.Mock).mockImplementation(() => ({
                deleteMission: mockDeleteMission
            }));

            await MissionController.deleteMission(mockRequest as Request, mockResponse as Response);

            expect(Mission.findByPk).toHaveBeenCalledWith(missionId);
            expect(mockDeleteMission).toHaveBeenCalledWith(missionId);
            expect(ResponseService).toHaveBeenCalledWith({
                data: null,
                res: mockResponse,
                status: 200,
                success: true,
                message: "Mission deleted successfully"
            });
        });

        it('should return error when mission not found for deletion', async () => {
            const missionId = '999';
            mockRequest.params = { id: missionId };
            (Mission.findByPk as jest.Mock).mockResolvedValue(null);

            await MissionController.deleteMission(mockRequest as Request, mockResponse as Response);

            expect(ResponseService).toHaveBeenCalledWith({
                data: null,
                res: mockResponse,
                message: "Mission not found",
                success: false,
                status: 400
            });
        });
    });
});