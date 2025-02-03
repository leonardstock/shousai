import { Card, CardHeader, CardTitle } from "../shared/Card";

const NoOrgHint = () => {
    return (
        <div className='space-y-4'>
            <Card className='border-2 border-blue-200 bg-blue-50'>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                        You currently don&apos;t belong to an organization.
                        Please go to your account settings and create or join
                        one to start using shousai.
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
};

export default NoOrgHint;
