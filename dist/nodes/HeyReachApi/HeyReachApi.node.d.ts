import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeListSearchResult, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
/**
 * Main HeyReach API Node
 */
export declare class HeyReachApi implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            getCampaigns(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
            getLists(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
        };
        loadOptions: {
            getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=HeyReachApi.node.d.ts.map