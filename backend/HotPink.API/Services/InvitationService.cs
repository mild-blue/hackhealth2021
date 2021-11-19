
using System.Collections.Concurrent;

using static HotPink.API.Controllers.DoctorController;
using static HotPink.API.Controllers.PatientController;

namespace HotPink.API.Services
{
    public class InvitationService
    {
        private readonly ConcurrentDictionary<string, CreateInvitationDto> _invitations = new();

        public bool Invite(CreateInvitationDto invitation) =>
            _invitations.TryAdd(invitation.InvitationCode, invitation);

        public CreateInvitationDto? Accept(AcceptInvitationDto invitation)
        {
            if(_invitations.TryGetValue(invitation.InvitationCode, out var result))
            {
                _invitations.TryRemove(invitation.InvitationCode, out _);
                return result;
            }
            else
            {
                return null;
            }
        }
    }
}
